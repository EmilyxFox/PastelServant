module.exports = {
    name: 'userInfo',
    description: 'Displays info about a guild member.',
    args: true,
    usage: '<@user>',
    guildOnly: true,
    cooldown: 0,
    execute(msg, args) {
        const dClient = msg.client;

        let allowedRoles = [];
        allowedRoles.push('Emote Empress', 'Staff Team', 'Emiwy');

        let nitroRole = [];
        nitroRole.push("Nitro Booster");

        if (msg.channel.type === "text") {

            if (!args[0]) {
                msg.channel.send("Please mention a user.");
                return;
            }



            //Check if commander is in allowedRoles
            if (msg.member.roles.cache.find(r => allowedRoles.indexOf(r.name) !== -1)) {
                //Get the mentioned member in args space 0
                let match = args[0].match(/<@!?(\d{17,19})>/);
                //Remove mentioned member from args
                args.shift();
                //Join rest of args into "reason"
                reason = args.join(` `);
                if (match) {
                    //Turn mention into userID, and find guildMember. Save in bannedUser
                    let mentionedMember = msg.guild.members.cache.get(match[1]);
                    //Time Calculation function
                    function calculateTime(timestamp) {
                        var time = new Date(timestamp);
                        var hours = time.getUTCHours();
                        var minutes = "0" + time.getUTCMinutes();
                        var seconds = "0" + time.getUTCSeconds();

                        var timeOutput = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                        return timeOutput;
                    }
                    //Date Calculation function
                    function calculateDate(timestamp) {
                        var date = new Date(timestamp);
                        var year = date.getUTCFullYear();
                        var month = date.getUTCMonth() + 1;
                        var day = date.getUTCDate();

                        var dateOutput = year + '/' + month + '/' + day;
                        return dateOutput;
                    }
                    var created = "📆" + calculateDate(mentionedMember.user.createdTimestamp) + "\n🕑" + calculateTime(mentionedMember.user.createdTimestamp) + " UTC";
                    var joined = "📆" + calculateDate(mentionedMember.joinedTimestamp) + "\n🕑" + calculateTime(mentionedMember.joinedTimestamp) + " UTC";

                    //Status
                    let statusTitle = "";
                    let statusValue = "";
                    switch (mentionedMember.user.presence.status) {
                        case "online":
                            statusTitle = "<:online:660753049219760140> Status:";
                            statusValue = "Online";
                            break;
                        case "idle":
                            statusTitle = "<:away:660753049417154561> Status:";
                            statusValue = "Away";
                            break;
                        case "dnd":
                            statusTitle = "<:dnd:660753049610092565> Status:"
                            statusValue = "Do Not Disturb";
                            break;
                        case "offline":
                            statusTitle = "<:offline:660753049488195596> Status:"
                            statusValue = "Offline";
                            break;
                    }

                    //Create userInfo embed
                    const embed = {
                        "title": "User Info",
                        "color": mentionedMember.displayColor,
                        "timestamp": new Date(),
                        "footer": {
                            "icon_url": msg.author.displayAvatarURL({ format: 'png', dymamic: true }),
                            "text": "Look-up by " + msg.author.tag
                        },
                        "thumbnail": {
                            "url": mentionedMember.user.displayAvatarURL({ format: 'png', dymamic: true })
                        },
                        "author": {
                            "name": dClient.user.username,
                            "icon_url": dClient.user.displayAvatarURL({ format: 'png', dymamic: true })
                        },
                        "fields": [
                            {
                                "name": "📜 Username:",
                                "value": mentionedMember.user.username,
                                "inline": true
                            },
                            {
                                "name": "🏷️ Discrim:",
                                "value": "`#" + mentionedMember.user.discriminator + "`",
                                "inline": true
                            },
                            {
                                "name": "🧬 ID:",
                                "value": "`" + mentionedMember.id + "`",
                                "inline": true
                            },
                            {
                                "name": "🃏 Nickname",
                                "value": mentionedMember.nickname || '`N/A`',
                                "inline": true
                            },
                            {
                                "name": "<:boost:660759462658965514> Booster:",
                                "value": (mentionedMember.premiumSince != null) ? 'Boosing!' : 'Not boosting',
                                "inline": true
                            },
                            {
                                "name": statusTitle,
                                "value": statusValue,
                                "inline": true
                            },
                            {
                                "name": "🔶 Account Creation Date:",
                                "value": created,
                                "inline": true
                            },
                            {
                                "name": "🔸 Joined Guild:",
                                "value": joined,
                                "inline": true
                            }
                        ]
                    };
                    msg.channel.send({ embed });

                    //If commander not in allowedRoles then send message
                } else {
                    msg.channel.send("Please mention a user.");
                }
            } else {
                msg.channel.send("Insufficient Permissions");
            }
        }else{
            msg.channel.send("You can't use this command in DMs. Please try again in a server chat.")
        }
    }
}

