export function getRandomInviteMessage(
  userName: string,
  clubName: string,
  clubId: string
) {
  const link = `https://caravanapp.ca/clubs/${clubId}`;
  const messages = [
    `Hey! ${userName} has invited you to join the club "${clubName}". You can check it out here: ${link}`,
    `Pssst... ${userName} has invited you to join the club "${clubName}" (it's super exclusive). Knock 3 times when you arrive: ${link}`,
    `Yoohoo! I've got a secret... ${userName} has invited you to join the club "${clubName}". Here's the link: ${link} The password for the gate is "swordfish".`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getRandomInviteMessageFromShelf(
  userName: string,
  clubName: string,
  clubId: string
) {
  const link = `https://caravanapp.ca/clubs/${clubId}`;
  const messages = [
    `Hey! ${userName} created a club based on a shelf you liked! The club's called "${clubName}" and they'd love for you to join. You can check it out here: ${link}`,
    `Pssst... ${userName} created a club based on a shelf you liked. The club's name is "${clubName}" and YOU are invited (it's super exclusive, so be proud). Knock 3 times when you arrive: ${link}`,
    `Yoohoo! I've got a secret... ${userName} created the "${clubName}" club based on a shelf you liked. Best part? You're invited to join :) Here's the link: ${link}. The password for the gate is "swordfish".`,
    `Here's the thing...you liked a shelf, then ${userName} created the club "${clubName}" based on the books on that shelf. Andddddd...yeah, let's just say you're invited :) NOT A BIG DEAL - STAY CALM! Here's the link: ${link}`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
