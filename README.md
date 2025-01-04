Birthday Reminder

This project is a Telegram bot built with Deno 2 that sends birthday reminders for friends listed in a Firebase Firestore database. The bot checks two days in advance for upcoming birthdays and sends a message with the names and ages of friends who will soon celebrate their birthdays. Data is added at https://birthday-e3caf.web.app/

Features:
Fetches birthday data from Firebase Firestore.
Filters friends whose birthdays are two days away.
Automatically sends birthday reminders via Telegram.
Uses a cron job to schedule daily reminders.
