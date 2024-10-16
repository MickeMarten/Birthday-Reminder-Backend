import { db } from "./firebase.js";
import Cron from "https://deno.land/x/croner@5.6.4/src/croner.js";
import { TmyFriend, TupdatedFriend } from "./interfaces.ts";
import { bot, chatID } from "./assemble-bot.ts";
import {
  collection,
  getDocs,
  QuerySnapshot,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

async function getAllFriends(): Promise<TmyFriend[] | null> {
  try {
    const listOfFriends: TmyFriend[] = [];
    const DbRef = collection(db, "Birthdays");
    const snapshot: QuerySnapshot = await getDocs(DbRef);
    if (snapshot.empty) {
      console.log("Databasen är tom");
      return null;
    }

    snapshot.forEach((person: QuerySnapshot) => {
      const friendsdata: TmyFriend = person.data() as TmyFriend;
      listOfFriends.push(friendsdata);
    });

    return listOfFriends;
  } catch (error) {
    console.error("Db verkar ha kraschat?", error);
    return [];
  }
}

function setTargetDate(): string {
  const today: Date = new Date();
  const twoDaysFromNow: Date = new Date(today);
  twoDaysFromNow.setDate(today.getDate() + 2);
  return twoDaysFromNow.toISOString().slice(5, 10);
}

async function organizeFriendsBirthdays(
  targetDate: string,
): Promise<TupdatedFriend[]> {
  const friends = await getAllFriends();
  if (!friends || friends.length < 1) {
    console.log("Listan är tom och något gick fel på vägen.");
    return [];
  }

  const updatedListOfFriends = friends.map((friend) => {
    const birthdayMonthAndDate: string = friend.birthDate.slice(5, 10);
    const birthDayYear: string = friend.birthDate.slice(0, 4);
    const fullBirthDate: Date = new Date(friend.birthDate);
    const today: Date = new Date();
    const age: number = fullBirthDate.getFullYear() - today.getFullYear();

    return {
      name: friend.name,
      birthYear: birthDayYear,
      birthMonthDate: birthdayMonthAndDate,
      age: age,
    };
  });

  return updatedListOfFriends.filter(
    (person) => person.birthMonthDate === targetDate,
  );
}

async function wakeUpBot(): Promise<void> {
  console.log("wakeUpBot started");
  const friendsAboutToHaveBirthday: TupdatedFriend[] =
    await organizeFriendsBirthdays(setTargetDate());
  console.log(`Found friends: ${JSON.stringify(friendsAboutToHaveBirthday)}`);

  const friendsNameList: string[] = friendsAboutToHaveBirthday.map((
    { name, age },
  ) => `${name} ${age} år`);

  const message: string = friendsNameList.length > 0
    ? `Om två dagar fyller ${friendsNameList.join(" och ")}`
    : `Ingen fyller år om två dagar =(`;

  try {
    await bot.api.sendMessage(chatID, message);
    console.log("Meddelande skickades:", message);
  } catch (error) {
    console.error("Fel vid skickande av meddelande:", error);
  }
}
wakeUpBot();

Deno.cron("sample cron", "0 6 * * *", () => {
  wakeUpBot();
});
