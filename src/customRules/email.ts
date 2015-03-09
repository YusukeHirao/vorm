module customRules {

	var patternMail: RegExp = /^([0-9a-z\.!\#$%&'*+\-\/=?^_`{|}~\(\)<>\[\]:;@,"\\\u0020]+)@((?:[0-9a-z][0-9a-z-]*\.)+[0-9a-z]{2,6}|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/i;
	var patternQuoted: RegExp = /^".+"$/g;
	var patternQuoteBeforeAndAfter: RegExp = /^"|"$/g;
	var patternEscapedBadChars: RegExp = /\\"|\\\\/g;
	var patternBadChars: RegExp = /"|\\/;
	var patternBadDot: RegExp = /^\.|\.{2,}|\.$/i;
	var patternlocalNonQuoteds: RegExp = /^[0-9a-z\.!#$%&'*+\-\/=?^_`{|}~]+$/i;

	interface IEmailOption {
	}

	export var email: ICustomRule = {

		is: function (value: string, options: IEmailOption, params: string[]): boolean {
			var mailMatch: string[];
			var local: string;
			var domain: string;
			var escaped: string;
			if (value.length > 256) {
				return false;
			}
			mailMatch = value.match(patternMail);
			if (!mailMatch) {
				return false;
			}
			local = mailMatch[1];
			domain = mailMatch[2];
			if (domain.length > 255) {
				return false;
			}
			if (local.length > 64) {
				return false;
			}
			if (patternQuoted.test(local)) {
				local = local.replace(patternQuoteBeforeAndAfter, '');
				escaped = local.replace(patternEscapedBadChars, '');
				if (patternBadChars.test(escaped)) {
					return false;
				}
				return true;
			}
			if (patternBadDot.test(local)) {
				return false;
			}
			if (!patternlocalNonQuoteds.test(local)) {
				return false;
			}
			return true;
		}

	}

}