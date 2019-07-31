(function () {
    "use strict";
    const _ = require("lodash");
    const config = require("./config.json");
    const Discord = require("discord.js");
    const formals = require("./formal.json");

    const client = new Discord.Client(),
        prefix = "!formal";

    const spellList = _.map(formals, function (o) {
        return "_" + _.map(o.name.split(" "), _.capitalize).join(" ").replace(",", ":") + "_";
    }).sort().join(", ");

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
        response = `${response}\n**Components**: _${formatComponents(spellDetails.components)}_`;

        if (spellDetails.notes) {
            response = `${response}\n${spellDetails.notes}`;
        }

        if (!spellDetails.cost) {
            spellDetails.cost = getGoldCost(spellDetails.components);
        }

        response = `${response}\n*Est. Cost: ${spellDetails.cost} gold.*`;

        return response;
    };


    let getGoldCost = function (components) {
        return _.reduce(components, function (cost, num, type) {
            if (type.toUpperCase() === "P") {
                cost += 3 * num;
            } else {
                cost += 2 * num;
            }
            return cost;
        }, 0);
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
                msg.reply(spellList);
                return;
            }

            results = _.filter(formals, function (o) {
                return o.name.toLowerCase().indexOf(args.toLowerCase()) !== -1;
                //return o.name.toLowerCase() === args.toLowerCase();
            });

            if (results.length > 0) {
                msg.reply(formatResponse(results[0]));
            } else {
                msg.reply(`Could NOT find formal named \`${args}\`.`);
            }
        } catch (e) {
            console.log("**ERROR OCCURRED IN MESSAGE HANDLER!**");
            console.log(e);
            msg.reply(`CALL AN AMBULANCE! I REQUIRE MEDICAL ATTENTION!\n${JSON.stringify(e)}`);
        }
    };


    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on("message", handleMessage);

    client.login(config.token);

})();
