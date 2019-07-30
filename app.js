(function () {
    "use strict";
    const _ = require("lodash");
    const Discord = require("discord.js");
    const formals = require("./formal.json");

    const client = new Discord.Client(),
        prefix = "!formal";

    /**
     * formatComponents
     * @param components
     * @returns {string}
     */
    let formatComponents = function (components) {
        return _.reduce(components, function (arr, value, key) {
            arr.push(key.toUpperCase() + value);
            return arr;
        }, []).join(", ");
    };


    /**
     * formatSchools
     * @param schools
     * @returns {string}
     */
    let formatSchools = function (schools) {
        return _.reduce(schools, function (arr, school) {
            if (school === "scroll-specific") {
                arr.push("_(Scroll-Specific)_");
            } else {
                arr.push(_.capitalize(school));
            }
            return arr;
        }, []).join(", ");
    };


    /**
     * formatResponse
     * @param spellDetails
     * @returns {string}
     */
    let formatResponse = function (spellDetails) {
        let response;

        response = `\n__**${spellDetails.name}**__`;
        response = `${response}\n**School**: ${formatSchools(spellDetails.schools)}`;
        response = `${response}\n**Level**: ${spellDetails.level}`;
        response = `${response}\n**Cost**: _${formatComponents(spellDetails.components)}_`;

        if (spellDetails.notes) {
            response = `${response}\n${spellDetails.notes}`;
        }

        return response;
    };


    /**
     * handleMessage
     * @param msg
     */
    let handleMessage = function (msg) {
        try {
            let args,
                results;

            if (!msg.content.startsWith(prefix) || msg.author.bot) {
                return;
            }

            args = msg.content.slice(prefix.length).trim();
            console.log(`Fetching ${args}`);

            if (args === "list") {
                msg.reply(_.map(formals, "name").join(", "));
                return;
            }

            results = _.filter(formals, function (o) {
                return o.name.toLowerCase() === args.toLowerCase();
            });

            if (results.length > 0) {
                msg.reply(formatResponse(results[0]));
            } else {
                msg.reply(`Could find formal named \`${args}\`.`);
            }
        } catch (e) {
            console.log("**ERROR OCCURED IN MESSAGE HANDLER!**");
            console.log(e);
            msg.reply(`CALL AN AMBULANCE! I REQUIRE MEDICAL ATTENTION!\n${JSON.stringify(e)}`);
        }
    };


    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on("message", handleMessage);

    client.login("NjA1ODM5OTAzODM3NzgyMDMy.XUCX5Q.L6lF7lQe2FcSYEz3INtQ6bNtfbo");

})();
