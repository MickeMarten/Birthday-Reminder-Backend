import { db } from "./firebase.js";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import Cron from "https://deno.land/x/croner@5.6.4/src/croner.js";
import { webhookCallback } from "https://deno.land/x/grammy@v1.30.0/mod.ts";
import bot from "./assemble-bot.ts"
import { TmyFriend, TupdatedFriend } from "./interfaces.ts";
import {
  collection,
  getDocs,
  QuerySnapshot,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";



const env = config(); 


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
    console.error("Db verkar ha crashat?");
    return [];
  }
}

function setTargetDate(): string {
  const today: Date = new Date();
  const twoDaysFromNow: Date = new Date(today);
  twoDaysFromNow.setDate(today.getDate() + 2);
  const targetDate = twoDaysFromNow.toISOString().slice(5, 10);
  return targetDate;
}

async function organizeFriendsBirthdays(
  targetDate: string
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
    const age: number = today.getFullYear() - fullBirthDate.getFullYear();

    return {
      name: friend.name,
      birthYear: birthDayYear,
      birthMonthDate: birthdayMonthAndDate,
      age: age,
    };
  });

  const filteredFriends = updatedListOfFriends.filter(
    (person) => person.birthMonthDate === targetDate
  );
  return filteredFriends;
}

async function wakeUpBot(): Promise<void> {
  const chatID: string = env.CHATID;
  console.log("Chat ID:", chatID); // Logga chatID

  if (!chatID) {
      throw new Error("CHATID is not defined!");
  }
  const friendsAboutToHaveBirthday: TupdatedFriend[] =
    await organizeFriendsBirthdays(setTargetDate());
  const friendsNameList: string[] = friendsAboutToHaveBirthday.map(
    ({ name, age }) => `${name} ${age} år`
  );

  const message: string =
    friendsNameList.length > 0
      ? `Om två dagar fyller ${friendsNameList.join(" och ")}`
      : `Ingen fyller år om två dagar =(`;

  if (!chatID) throw new Error("ChatID saknas");

  await bot.api.sendMessage(chatID, message);
}
wakeUpBot()
const _cronJob = new Cron("0 11 * * *", wakeUpBot); 
