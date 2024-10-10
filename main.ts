import { db } from "./firebase.js";
import Cron from "https://deno.land/x/croner@5.6.4/src/croner.js";
import { assembleBot } from "./assemble-bot.ts";
import {
  collection,
  getDocs,
  QuerySnapshot,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

interface TmyFriend {
  name: string;
  birthDate: string;
  ageAtUseage: string;
}
interface TupdatedFriend {
  name: string;
  birthYear: string;
  birthMonthDate: string;
  ageAtUseage: string;
}

const {bot, chatID} = assembleBot()
bot.start();



async function getAllFriends(): Promise<TmyFriend[]> {
  const listOfFriends: TmyFriend[] = [];
  const DbRef = collection(db, "Birthdays");
  const snapshot: QuerySnapshot = await getDocs(DbRef);

  snapshot.forEach((person: QuerySnapshot) => {
    const friendsdata: TmyFriend = person.data() as TmyFriend;
    listOfFriends.push(friendsdata);
  });

  return listOfFriends;
}

function setTargetDate(): string {
  const today: Date = new Date();
  const twoDaysFromNow: Date = new Date(today);
  twoDaysFromNow.setDate(today.getDate() + 2);
  const targetDate = twoDaysFromNow.toISOString().slice(5, 10);
  console.log("Target Date:", targetDate); 
  return targetDate;
}

async function organizeFriendsBirthdays(targetDate: string): Promise<TupdatedFriend[]> {
  const friends = await getAllFriends();
  
  const updatedListOfFriends = friends.map((friend) => {
    const birthdayMonthAndDate = friend.birthDate.slice(5, 10);
    const birthDayYear = friend.birthDate.slice(0, 4);
    return {
      name: friend.name,
      birthYear: birthDayYear,
      birthMonthDate: birthdayMonthAndDate,
      ageAtUseage: friend.ageAtUseage,
    };
  });

  
  const filteredFriends = updatedListOfFriends.filter(
    (person) => person.birthMonthDate === targetDate
  );
  return filteredFriends;
}



async function wakeUpBot() {
  const friendsAboutToHaveBirthday = await organizeFriendsBirthdays(setTargetDate());

  const friendsNameList = friendsAboutToHaveBirthday.map(
    (friends) => friends.name
  );

  let message =
    friendsNameList.length > 0
      ? `Om två dagar fyller ${friendsNameList.join(", ")} år =)`
      : `Ingen fyller år om två dagar =(`;

  await bot.api.sendMessage(chatID, message);
}


const _cronJob = Cron("0 9 * * *", wakeUpBot);
