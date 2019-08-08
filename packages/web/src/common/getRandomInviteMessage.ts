export function getRandomInviteMessage(
  userName: string,
  clubName: string,
  clubId: string
) {
  const messages = [
    `Hey! ${userName} has invited you to join the club "${clubName}". You can check it out here: https://caravanapp.ca/clubs/${clubId}.`,
    `Pssst... ${userName} has invited you to join the club "${clubName}" (it's super exclusive). Knock 3 times when you arrive: https://caravanapp.ca/clubs/${clubId}.`,
    `Yoohoo! I've got a secret... ${userName} has invited you to join the club "${clubName}". Here's the link: https://caravanapp.ca/clubs/${clubId}. The password for the gate is "swordfish".`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
