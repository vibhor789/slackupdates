#!/usr/bin/env node

/**
 * Slack Daily Updates to Google Sheets
 *
 * This script fetches messages from Slack channels and DMs from the last 24 hours
 * and appends them to a Google Sheet.
 *
 * Setup:
 * 1. npm install
 * 2. Set environment variables (see .env.example)
 * 3. Run: node slack-to-sheets.js
 */

require('dotenv').config();

const { WebClient } = require('@slack/web-api');
const { google } = require('googleapis');
const fs = require('fs');

// Configuration from environment variables
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH || './google-credentials.json';
const HOURS_TO_FETCH = parseInt(process.env.HOURS_TO_FETCH || '24');

// Initialize Slack client
const slack = new WebClient(SLACK_BOT_TOKEN);

// Initialize Google Sheets client
let sheets;

async function initGoogleSheets() {
  const credentials = JSON.parse(fs.readFileSync(GOOGLE_CREDENTIALS_PATH));

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  sheets = google.sheets({ version: 'v4', auth: authClient });
}

async function getAllChannels() {
  console.log('Fetching all channels and DMs...');

  const channelTypes = ['public_channel', 'private_channel', 'mpim', 'im'];
  const channels = [];
  let cursor;

  do {
    const result = await slack.conversations.list({
      types: channelTypes.join(','),
      exclude_archived: true,
      limit: 200,
      cursor: cursor
    });

    channels.push(...result.channels);
    cursor = result.response_metadata?.next_cursor;
  } while (cursor);

  console.log(`Found ${channels.length} channels/DMs`);
  return channels;
}

async function getChannelHistory(channelId, channelName, oldestTimestamp) {
  try {
    const result = await slack.conversations.history({
      channel: channelId,
      oldest: oldestTimestamp,
      limit: 100
    });

    if (!result.ok) {
      console.error(`Error fetching ${channelName}: ${result.error}`);
      return [];
    }

    return result.messages || [];
  } catch (error) {
    if (error.data?.error === 'not_in_channel') {
      console.log(`Skipping ${channelName} - bot not in channel`);
    } else {
      console.error(`Error fetching ${channelName}:`, error.message);
    }
    return [];
  }
}

async function getUserInfo(userId) {
  try {
    const result = await slack.users.info({ user: userId });
    return result.user?.real_name || result.user?.name || userId;
  } catch (error) {
    return userId;
  }
}

function formatMessage(message, channelName) {
  const timestamp = parseFloat(message.ts) * 1000;
  const date = new Date(timestamp);

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const user = message.user || message.bot_id || message.username || 'Unknown';
  const text = message.text || '';
  const isThreadReply = message.thread_ts && message.thread_ts !== message.ts;

  const reactions = message.reactions
    ? message.reactions.map(r => `${r.name} (${r.count})`).join(', ')
    : '';

  const attachmentCount = (message.files?.length || 0) + (message.attachments?.length || 0);
  const attachmentInfo = attachmentCount > 0 ? `${attachmentCount} file(s)` : 'None';

  return [
    formattedDate,
    formattedTime,
    channelName,
    user,
    text,
    isThreadReply ? 'Yes' : 'No',
    reactions,
    attachmentInfo
  ];
}

async function appendToGoogleSheet(rows) {
  if (rows.length === 0) {
    console.log('No messages to append');
    return;
  }

  console.log(`Appending ${rows.length} messages to Google Sheet...`);

  await sheets.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: 'Sheet1!A:H',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: rows
    }
  });

  console.log('Successfully appended to Google Sheet');
}

async function main() {
  console.log('Starting Slack to Google Sheets sync...');
  console.log(`Fetching messages from last ${HOURS_TO_FETCH} hours`);

  // Initialize Google Sheets
  await initGoogleSheets();

  // Calculate timestamp for X hours ago
  const hoursAgo = Date.now() - (HOURS_TO_FETCH * 60 * 60 * 1000);
  const oldestTimestamp = (hoursAgo / 1000).toString();

  // Get all channels
  const channels = await getAllChannels();

  // Collect all messages
  const allRows = [];

  for (const channel of channels) {
    const channelName = channel.name || channel.user || `DM-${channel.id}`;
    console.log(`Processing: ${channelName}`);

    const messages = await getChannelHistory(channel.id, channelName, oldestTimestamp);

    for (const message of messages) {
      const row = formatMessage(message, channelName);
      allRows.push(row);
    }

    // Rate limiting - wait 1 second between channels
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Sort by timestamp (oldest first)
  allRows.sort((a, b) => {
    const dateA = new Date(a[0] + ' ' + a[1]);
    const dateB = new Date(b[0] + ' ' + b[1]);
    return dateA - dateB;
  });

  // Append to Google Sheet
  await appendToGoogleSheet(allRows);

  console.log('✅ Sync complete!');
  console.log(`Total messages processed: ${allRows.length}`);
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
