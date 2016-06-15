var https = require('https');

exports.id = 'youtube';
exports.desc = 'Automated YouTube link recognition';

exports.init = function () {
	return;
};

function getLinkId (msg) {
	msg = msg.split(' ');
	for (var i = 0; i < msg.length; i++) {
		if ((/youtu\.be/i).test(msg[i])) {
			var temp = msg[i].split('/');
			return temp[temp.length - 1];
		} else if ((/youtube\.com/i).test(msg[i])) {
			return msg[i].substring(msg[i].indexOf("=") + 1).replace(".", "");
		}
	}
}

function parseChat (room, time, by, msg) {
	var enableByDefault = Config.youtube ? Config.youtube.enableByDefault : false;
	var enabled = enableByDefault;
	if (Settings.settings['ytlinks'] && typeof Settings.settings['ytlinks'][room] !== "undefined") {
		enabled = !!Settings.settings['ytlinks'][room];
	}
	if (enabled && ((/youtube\.com/i).test(msg) || (/youtu\.be/i).test(msg))) {
		var transYT = function (data) {
			var tempLang = Config.language || 'english';
			if (Settings.settings['language'] && Settings.settings['language'][room]) tempLang = Settings.settings['language'][room];
			return Tools.translateGlobal('youtube', data, tempLang);
		};
		try {
			var id = getLinkId(msg);
			if (!id) return;
			var options = {
				host: 'www.googleapis.com',
				path: '/youtube/v3/videos?id=' + id + '&key=AIzaSyBHyOyjHSrOW5wiS5A55Ekx4df_qBp6hkQ&fields=items(snippet(channelId,title,categoryId))&part=snippet'
			};
			var callback = function (response) {
				var str = '';
				response.on('data', function (chunk) {
					str += chunk;
				});
				response.on('end', function () {
					try {
						var youTubeData = JSON.parse(str);
						if (youTubeData.items && youTubeData.items.length && youTubeData.items[0].snippet) {
							var toSay = ('/utube ' + by + ', ' + youTubeData.items[0].snippet.title);
							Bot.say(room, toSay);
							//console.log(toSay);
						}
					} catch (e) {}
				});
				response.on('error', function (e) {
					debug('failed on connection with YouTube');
				});
			};
			var ytErr = function (e) {
				debug('failed on connection with YouTube');
			};
			var req = https.request(options, callback);
			req.on('error', ytErr);
			req.end();
		} catch (e) {
			errlog(e.stack);
		}
	}
}

exports.parse = function (room, message, isIntro, spl) {
	if (isIntro) return;
	if (!Bot.rooms[room] || Bot.rooms[room].type !== "chat") return;
	var by, timeOff;
	switch (spl[0]) {
		case 'c':
			by = spl[1];
			timeOff = Date.now();
			parseChat(room, timeOff, by, message.substr(("|" + spl[0] + "|" + spl[1] + "|").length));
			break;
		case 'c:':
			by = spl[2];
			timeOff = parseInt(spl[1]) * 1000;
			parseChat(room, timeOff, by, message.substr(("|" + spl[0] + "|" + spl[1] + "|" + spl[2] + "|").length));
			break;
	}
};

exports.destroy = function () {
	if (Features[exports.id]) delete Features[exports.id];
};








/* Pokemon Showdown hashColor function
 * This gives the color of a username
 * based on the userid.
*/

var MD5 = require('MD5');
var colorCache = {};

// hashColor function

function hashColor(name) {
	name = toId(name);
	if (mainCustomColors[name]) name = mainCustomColors[name];
	if (colorCache[name]) return colorCache[name];
	var hash = MD5(name);
	var H = parseInt(hash.substr(4, 4), 16) % 360;
	var S = parseInt(hash.substr(0, 4), 16) % 50 + 50;
	var L = Math.floor(parseInt(hash.substr(8, 4), 16) % 20 / 2 + 30);
	var rgb = hslToRgb(H, S, L);
	colorCache[name] = "#" + rgbToHex(rgb.r, rgb.g, rgb.b);
	return colorCache[name];
}
//Gold.hashColor = hashColor;

// Mains custom username colors
var mainCustomColors = {
	'theimmortal': 'taco',
	'bmelts': 'testmelts',
	'zarel': 'aeo',
	'zarell': 'aeo',
	'greatsage': 'test454',
	'snowflakes': 'snowflake',
	'jumpluff': 'zacchaeus',
	'zacchaeus': 'jumpluff',
	'kraw': 'kraw1',
	'growlithe': 'steamroll',
	'snowflakes': 'endedinariot',
	'doomvendingmachine': 'theimmortal',
	'mikel': 'mikkel',
	'arcticblast': 'rsem',
	'mjb': 'thefourthchaser',
	'thefourthchaser': 'mjb',
	'tfc': 'mjb',
	'mikedecishere': 'mikedec3boobs',
	'heartsonfire': 'haatsuonfaiyaa',
	'royalty': 'wonder9',
	// 'osiris': 'yamraiha',
	'limi': 'azure2',
	'haunter': 'cathy',
	'ginganinja': 'piratesandninjas',
	'aurora': 'c6n6fek',
	'jdarden': 'danielcross',
	'solace': 'amorlan',
	'dcae': 'galvatron',
	'queenofrandoms': 'hahaqor',
	'jelandee': 'thejelandee',
	'diatom': 'dledledlewhooop',
	'waterbomb': 'wb0',
	'texascloverleaf': 'aggronsmash',
	'treecko': 'treecko56',
	'treecko37': 'treecko56',
	'violatic': 'violatic92',
	'exeggutor': 'ironmanatee',
	'ironmanatee': 'exeggutor',
	// 'shamethat': 'aaa10',
	'skylight': 'aerithass',
	// 'prem': 'premisapieceofshit',
	'goddessbriyella': 'jolteonxvii', // third color change
	'nekonay': 'catbot20',
	'coronis': 'kowonis',
	'vaxter': 'anvaxter',
	'mattl': 'mattl34',
	'shaymin': 'test33',
	// 'orphic': 'dmt6922',
	'kayo': 'endedinariot',
	'tgmd': 'greatmightydoom',
	'vacate': 'vaat111111111',
	'bean': 'dragonbean',
	'yunan': 'osiris13',
	'politoed': 'brosb4hoohs',
	'scotteh': 'nsyncluvr67',
	'bumbadadabum': 'puckerluvr69',
	'yuihirasawa': 'weeabookiller',
	'monohearted': 'nighthearted',
	'prem': 'erinanakiri', // second color change
	'clefairy': 'fuckes',
	'morfent': 'aaaa',
	'crobat': 'supergaycrobat4',
	'beowulf': '298789z7z',
	'flippy': 'flippo',
	'raoulsteve247': 'raoulbuildingpc',
	'thedeceiver': 'colourtest011',
	'darnell': 'ggggggg',
	'shamethat': 'qpwkfklkjpskllj', // second color change
	'aipom': 'wdsddsdadas',
	'alter': 'spakling',
	'biggie': 'aoedoedad',
	'osiris': 'osiris12', // second color change
	'azumarill': 'azumarill69',
	'redew': 'redeww',
	'sapphire': 'masquerains',
	'calyxium': 'calyxium142',
	'kiracookie': 'kracookie',
	'blitzamirin': 'hikaruhitachii',
	'skitty': 'shckieei',
	'sweep': 'jgjjfgdfg', // second color change
	'panpawn': 'crowt',
	'val': 'pleasegivemecolorr',
	'valentine': 'pleasegivemecolorr',
	'briayan': 'haxorusxi',
	'xzern': 'mintycolors',
	'shgeldz': 'cactusl00ver',
	'abra': 'lunchawaits',
	'maomiraen': 'aaaaaa',
	'trickster': 'sunako',
	'articuno': 'bluekitteh177',
	// 'antemortem': 'abc11092345678',
	'scene': 'aspire',
	'barton': 'hollywood15',
	// 'psych': 'epicwome',
	'zodiax': 'coldeann',
	'ninetynine': 'blackkkk',
	'kasumi': 'scooter4000',
	'xylen': 'bloodyrevengebr',
	'aelita': 'y34co3',
	'fx': 'cm48ubpq',
	'horyzhnz': 'superguy69',
	'quarkz': 'quarkz345',
	'fleurdyleurse': 'calvaryfishes',
	'trinitrotoluene': '4qpr7pc5mb',
	'rekeri': 'qgadlu6g',
	'austin': 'jkjkjkjkjkgdl',
	'jinofthegale': 'cainvelasquez',
	'waterbomb': 'naninan',
	'starbloom': 'taigaaisaka',
	'macle': 'flogged',
	'ashiemore': 'poncp',
	'charles': 'charlescarmichael',
	'sigilyph': 'ek6',
	'spy': 'spydreigon',
	'kinguu': 'dodmen',
	'dodmen': 'kinguu',
	'halite': 'cjilkposqknolssss',
	'magnemite': 'dsfsdffs',
	'ace': 'sigilyph143',
	'leftiez': 'xxxxnbbhiojll',
	'grim': 'grimoiregod',
	'strength': '0v0tqpnu',
	'iplaytennislol': 'nsyncluvr67',
	'cathy': '' //{color: '#ff5cb6'}
};

function hslToRgb(h, s, l) {
	var r, g, b, m, c, x;
	if (!isFinite(h)) h = 0;
	if (!isFinite(s)) s = 0;
	if (!isFinite(l)) l = 0;
	h /= 60;
	if (h < 0) h = 6 - (-h % 6);
	h %= 6;
	s = Math.max(0, Math.min(1, s / 100));
	l = Math.max(0, Math.min(1, l / 100));
	c = (1 - Math.abs((2 * l) - 1)) * s;
	x = c * (1 - Math.abs((h % 2) - 1));
	if (h < 1) {
		r = c;
		g = x;
		b = 0;
	} else if (h < 2) {
		r = x;
		g = c;
		b = 0;
	} else if (h < 3) {
		r = 0;
		g = c;
		b = x;
	} else if (h < 4) {
		r = 0;
		g = x;
		b = c;
	} else if (h < 5) {
		r = x;
		g = 0;
		b = c;
	} else {
		r = c;
		g = 0;
		b = x;
	}
	m = l - c / 2;
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);
	return {
		r: r,
		g: g,
		b: b
	};
}

function rgbToHex(R, G, B) {
	return toHex(R) + toHex(G) + toHex(B);
}

function toHex(N) {
	if (N == null) return "00";
	N = parseInt(N);
	if (N == 0 || isNaN(N)) return "00";
	N = Math.max(0, N);
	N = Math.min(N, 255);
	N = Math.round(N);
	return "0123456789ABCDEF".charAt((N - N % 16) / 16) + "0123456789ABCDEF".charAt(N % 16);
}
