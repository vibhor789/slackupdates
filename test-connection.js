#!/usr/bin/env node

/**
 * Test script to verify Slack and Google Sheets connections
 */

require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const { google } = require('googleapis');
const fs = require('fs');

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH || './google-credentials.json';

async function testSlackConnection() {
  console.log('\n🔍 Testing Slack Connection...');

  if (!SLACK_BOT_TOKEN) {
    console.error('❌ SLACK_BOT_TOKEN not set in .env file');
    return false;
  }

  if (!SLACK_BOT_TOKEN.startsWith('xoxb-')) {
    console.error('❌ Token should start with "xoxb-" (Bot User OAuth Token)');
    console.error(`   Your token starts with: ${SLACK_BOT_TOKEN.substring(0, 10)}...`);
    return false;
  }

  const slack = new WebClient(SLACK_BOT_TOKEN);

  try {
    const auth = await slack.auth.test();
    console.log('✅ Slack connection successful!');
    console.log(`   Workspace: ${auth.team}`);
    console.log(`   Bot User: ${auth.user}`);
    console.log(`   Bot ID: ${auth.bot_id}`);

    // Test scopes
    console.log('\n🔍 Testing required scopes...');

    try {
      const channels = await slack.conversations.list({ limit: 1 });
      console.log('✅ channels:read scope working');
    } catch (error) {
      console.error('❌ channels:read scope missing or not working');
    }

    try {
      // Try to get a channel's history (might fail if bot not in any channels)
      const channelsList = await slack.conversations.list({ limit: 1, types: 'public_channel' });
      if (channelsList.channels && channelsList.channels.length > 0) {
        const channelId = channelsList.channels[0].id;
        await slack.conversations.history({ channel: channelId, limit: 1 });
        console.log('✅ channels:history scope working');
      } else {
        console.log('⚠️  No channels found to test history scope');
      }
    } catch (error) {
      if (error.data?.error === 'missing_scope') {
        console.error('❌ channels:history scope MISSING!');
        console.error(`   Needed: ${error.data.needed}`);
      } else if (error.data?.error === 'not_in_channel') {
        console.log('✅ channels:history scope exists (bot just not in channel yet)');
      } else {
        console.error('❌ Error testing history scope:', error.message);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Slack connection failed:', error.message);
    if (error.data?.error) {
      console.error(`   Error: ${error.data.error}`);
    }
    return false;
  }
}

async function testGoogleSheetsConnection() {
  console.log('\n🔍 Testing Google Sheets Connection...');

  if (!GOOGLE_SHEET_ID) {
    console.error('❌ GOOGLE_SHEET_ID not set in .env file');
    return false;
  }

  if (!fs.existsSync(GOOGLE_CREDENTIALS_PATH)) {
    console.error(`❌ Google credentials file not found: ${GOOGLE_CREDENTIALS_PATH}`);
    return false;
  }

  try {
    const credentials = JSON.parse(fs.readFileSync(GOOGLE_CREDENTIALS_PATH));

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Test reading from the sheet
    const response = await sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_SHEET_ID
    });

    console.log('✅ Google Sheets connection successful!');
    console.log(`   Sheet Name: ${response.data.properties.title}`);
    console.log(`   Sheets: ${response.data.sheets.map(s => s.properties.title).join(', ')}`);

    return true;
  } catch (error) {
    console.error('❌ Google Sheets connection failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('=================================');
  console.log('Slack to Sheets - Connection Test');
  console.log('=================================');

  const slackOk = await testSlackConnection();
  const sheetsOk = await testGoogleSheetsConnection();

  console.log('\n=================================');
  console.log('Test Results:');
  console.log('=================================');
  console.log(`Slack:         ${slackOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Google Sheets: ${sheetsOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log('=================================\n');

  if (slackOk && sheetsOk) {
    console.log('🎉 All connections working! Ready to run the script.');
    process.exit(0);
  } else {
    console.log('❌ Please fix the errors above before running the script.');
    process.exit(1);
  }
}

main();
