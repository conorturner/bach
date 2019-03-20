const codeLookups = [
	{ "CAMEOEVENTCODE": 1, "EVENTDESCRIPTION": "MAKE PUBLIC STATEMENT" },
	{
		"CAMEOEVENTCODE": 10,
		"EVENTDESCRIPTION": "Make statement, not specified below"
	},
	{ "CAMEOEVENTCODE": 11, "EVENTDESCRIPTION": "Decline comment" }, {
		"CAMEOEVENTCODE": 12,
		"EVENTDESCRIPTION": "Make pessimistic comment"
	},
	{ "CAMEOEVENTCODE": 13, "EVENTDESCRIPTION": "Make optimistic comment" }, {
		"CAMEOEVENTCODE": 14,
		"EVENTDESCRIPTION": "Consider policy option"
	},
	{ "CAMEOEVENTCODE": 15, "EVENTDESCRIPTION": "Acknowledge or claim responsibility" }, {
		"CAMEOEVENTCODE": 16,
		"EVENTDESCRIPTION": "Deny responsibility"
	},
	{ "CAMEOEVENTCODE": 17, "EVENTDESCRIPTION": "Engage in symbolic act" }, {
		"CAMEOEVENTCODE": 18,
		"EVENTDESCRIPTION": "Make empathetic comment"
	},
	{ "CAMEOEVENTCODE": 19, "EVENTDESCRIPTION": "Express accord" },
	{
		"CAMEOEVENTCODE": 2,
		"EVENTDESCRIPTION": "APPEAL"
	},
	{ "CAMEOEVENTCODE": 20, "EVENTDESCRIPTION": "Appeal, not specified below" }, {
		"CAMEOEVENTCODE": 21,
		"EVENTDESCRIPTION": "Appeal for material cooperation, not specified below"
	}, { "CAMEOEVENTCODE": 211, "EVENTDESCRIPTION": "Appeal for economic cooperation" }, {
		"CAMEOEVENTCODE": 212,
		"EVENTDESCRIPTION": "Appeal for military cooperation"
	}, { "CAMEOEVENTCODE": 213, "EVENTDESCRIPTION": "Appeal for judicial cooperation" }, {
		"CAMEOEVENTCODE": 214,
		"EVENTDESCRIPTION": "Appeal for intelligence"
	}, {
		"CAMEOEVENTCODE": 22,
		"EVENTDESCRIPTION": "Appeal for diplomatic cooperation, such as policy support"
	}, { "CAMEOEVENTCODE": 23, "EVENTDESCRIPTION": "Appeal for aid, not specified below" }, {
		"CAMEOEVENTCODE": 231,
		"EVENTDESCRIPTION": "Appeal for economic aid"
	}, { "CAMEOEVENTCODE": 232, "EVENTDESCRIPTION": "Appeal for military aid" }, {
		"CAMEOEVENTCODE": 233,
		"EVENTDESCRIPTION": "Appeal for humanitarian aid"
	}, {
		"CAMEOEVENTCODE": 234,
		"EVENTDESCRIPTION": "Appeal for military protection or peacekeeping"
	}, {
		"CAMEOEVENTCODE": 24,
		"EVENTDESCRIPTION": "Appeal for political reform, not specified below"
	}, { "CAMEOEVENTCODE": 241, "EVENTDESCRIPTION": "Appeal for change in leadership" }, {
		"CAMEOEVENTCODE": 242,
		"EVENTDESCRIPTION": "Appeal for policy change"
	}, { "CAMEOEVENTCODE": 243, "EVENTDESCRIPTION": "Appeal for rights" }, {
		"CAMEOEVENTCODE": 244,
		"EVENTDESCRIPTION": "Appeal for change in institutions, regime"
	}, { "CAMEOEVENTCODE": 25, "EVENTDESCRIPTION": "Appeal to yield" }, {
		"CAMEOEVENTCODE": 251,
		"EVENTDESCRIPTION": "Appeal for easing of administrative sanctions"
	}, { "CAMEOEVENTCODE": 252, "EVENTDESCRIPTION": "Appeal for easing of popular dissent" }, {
		"CAMEOEVENTCODE": 253,
		"EVENTDESCRIPTION": "Appeal for release of persons or property"
	}, {
		"CAMEOEVENTCODE": 254,
		"EVENTDESCRIPTION": "Appeal for easing of economic sanctions, boycott, or embargo"
	}, {
		"CAMEOEVENTCODE": 255,
		"EVENTDESCRIPTION": "Appeal for target to allow international involvement (non-mediation)"
	}, {
		"CAMEOEVENTCODE": 256,
		"EVENTDESCRIPTION": "Appeal for de-escalation of military engagement"
	}, { "CAMEOEVENTCODE": 26, "EVENTDESCRIPTION": "Appeal to others to meet or negotiate" }, {
		"CAMEOEVENTCODE": 27,
		"EVENTDESCRIPTION": "Appeal to others to settle dispute"
	}, {
		"CAMEOEVENTCODE": 28,
		"EVENTDESCRIPTION": "Appeal to others to engage in or accept mediation"
	}, { "CAMEOEVENTCODE": 3, "EVENTDESCRIPTION": "EXPRESS INTENT TO COOPERATE" }, {
		"CAMEOEVENTCODE": 30,
		"EVENTDESCRIPTION": "Express intent to cooperate, not specified below"
	}, {
		"CAMEOEVENTCODE": 31,
		"EVENTDESCRIPTION": "Express intent to engage in material cooperation, not specified below"
	}, { "CAMEOEVENTCODE": 311, "EVENTDESCRIPTION": "Express intent to cooperate economically" }, {
		"CAMEOEVENTCODE": 312,
		"EVENTDESCRIPTION": "Express intent to cooperate militarily"
	}, {
		"CAMEOEVENTCODE": 313,
		"EVENTDESCRIPTION": "Express intent to cooperate on judicial matters"
	}, { "CAMEOEVENTCODE": 314, "EVENTDESCRIPTION": "Express intent to cooperate on intelligence" }, {
		"CAMEOEVENTCODE": 32,
		"EVENTDESCRIPTION": "Express intent to provide diplomatic cooperation such as policy support"
	}, {
		"CAMEOEVENTCODE": 33,
		"EVENTDESCRIPTION": "Express intent to provide matyerial aid, not specified below"
	}, { "CAMEOEVENTCODE": 331, "EVENTDESCRIPTION": "Express intent to provide economic aid" }, {
		"CAMEOEVENTCODE": 332,
		"EVENTDESCRIPTION": "Express intent to provide military aid"
	}, { "CAMEOEVENTCODE": 333, "EVENTDESCRIPTION": "Express intent to provide humanitarian aid" }, {
		"CAMEOEVENTCODE": 334,
		"EVENTDESCRIPTION": "Express intent to provide military protection or peacekeeping"
	}, {
		"CAMEOEVENTCODE": 34,
		"EVENTDESCRIPTION": "Express intent to institute political reform, not specified below"
	}, { "CAMEOEVENTCODE": 341, "EVENTDESCRIPTION": "Express intent to change leadership" }, {
		"CAMEOEVENTCODE": 342,
		"EVENTDESCRIPTION": "Express intent to change policy"
	}, { "CAMEOEVENTCODE": 343, "EVENTDESCRIPTION": "Express intent to provide rights" }, {
		"CAMEOEVENTCODE": 344,
		"EVENTDESCRIPTION": "Express intent to change institutions, regime"
	}, {
		"CAMEOEVENTCODE": 35,
		"EVENTDESCRIPTION": "Express intent to yield, not specified below"
	}, {
		"CAMEOEVENTCODE": 351,
		"EVENTDESCRIPTION": "Express intent to ease administrative sanctions"
	}, { "CAMEOEVENTCODE": 352, "EVENTDESCRIPTION": "Express intent to ease popular dissent" }, {
		"CAMEOEVENTCODE": 353,
		"EVENTDESCRIPTION": "Express intent to release persons or property"
	}, {
		"CAMEOEVENTCODE": 354,
		"EVENTDESCRIPTION": "Express intent to ease economic sanctions, boycott, or embargo"
	}, {
		"CAMEOEVENTCODE": 355,
		"EVENTDESCRIPTION": "Express intent allow international involvement (not mediation)"
	}, {
		"CAMEOEVENTCODE": 356,
		"EVENTDESCRIPTION": "Express intent to de-escalate military engagement "
	}, { "CAMEOEVENTCODE": 36, "EVENTDESCRIPTION": "Express intent to meet or negotiate" }, {
		"CAMEOEVENTCODE": 37,
		"EVENTDESCRIPTION": "Express intent to settle dispute"
	}, { "CAMEOEVENTCODE": 38, "EVENTDESCRIPTION": "Express intent to accept mediation" }, {
		"CAMEOEVENTCODE": 39,
		"EVENTDESCRIPTION": "Express intent to mediate"
	}, { "CAMEOEVENTCODE": 4, "EVENTDESCRIPTION": "CONSULT" }, {
		"CAMEOEVENTCODE": 40,
		"EVENTDESCRIPTION": "Consult, not specified below"
	}, { "CAMEOEVENTCODE": 41, "EVENTDESCRIPTION": "Discuss by telephone" }, {
		"CAMEOEVENTCODE": 42,
		"EVENTDESCRIPTION": "Make a visit"
	}, { "CAMEOEVENTCODE": 43, "EVENTDESCRIPTION": "Host a visit" }, {
		"CAMEOEVENTCODE": 44,
		"EVENTDESCRIPTION": "Meet at a Ã’hirdÃ“location"
	}, { "CAMEOEVENTCODE": 45, "EVENTDESCRIPTION": "Mediate" }, {
		"CAMEOEVENTCODE": 46,
		"EVENTDESCRIPTION": "Engage in negotiation"
	}, { "CAMEOEVENTCODE": 5, "EVENTDESCRIPTION": "ENGAGE IN DIPLOMATIC COOPERATION" }, {
		"CAMEOEVENTCODE": 50,
		"EVENTDESCRIPTION": "Engage in diplomatic cooperation, not specified below"
	}, { "CAMEOEVENTCODE": 51, "EVENTDESCRIPTION": "Praise or endorse" }, {
		"CAMEOEVENTCODE": 52,
		"EVENTDESCRIPTION": "Defend verbally"
	}, { "CAMEOEVENTCODE": 53, "EVENTDESCRIPTION": "Rally support on behalf of" }, {
		"CAMEOEVENTCODE": 54,
		"EVENTDESCRIPTION": "Grant diplomatic recognition"
	}, { "CAMEOEVENTCODE": 55, "EVENTDESCRIPTION": "Apologize" }, {
		"CAMEOEVENTCODE": 56,
		"EVENTDESCRIPTION": "Forgive"
	}, { "CAMEOEVENTCODE": 57, "EVENTDESCRIPTION": "Sign formal agreement" }, {
		"CAMEOEVENTCODE": 6,
		"EVENTDESCRIPTION": "ENGAGE IN MATERIAL COOPERATION"
	}, {
		"CAMEOEVENTCODE": 60,
		"EVENTDESCRIPTION": "Engage in material cooperation, not specified below"
	}, { "CAMEOEVENTCODE": 61, "EVENTDESCRIPTION": "Cooperate economically" }, {
		"CAMEOEVENTCODE": 62,
		"EVENTDESCRIPTION": "Cooperate militarily"
	}, { "CAMEOEVENTCODE": 63, "EVENTDESCRIPTION": "Engage in judicial cooperation" }, {
		"CAMEOEVENTCODE": 64,
		"EVENTDESCRIPTION": "Share intelligence or information"
	}, { "CAMEOEVENTCODE": 7, "EVENTDESCRIPTION": "PROVIDE AID" }, {
		"CAMEOEVENTCODE": 70,
		"EVENTDESCRIPTION": "Provide aid, not specified below"
	}, { "CAMEOEVENTCODE": 71, "EVENTDESCRIPTION": "Provide economic aid" }, {
		"CAMEOEVENTCODE": 72,
		"EVENTDESCRIPTION": "Provide military aid"
	}, { "CAMEOEVENTCODE": 73, "EVENTDESCRIPTION": "Provide humanitarian aid" }, {
		"CAMEOEVENTCODE": 74,
		"EVENTDESCRIPTION": "Provide military protection or peacekeeping"
	}, { "CAMEOEVENTCODE": 75, "EVENTDESCRIPTION": "Grant asylum" }, {
		"CAMEOEVENTCODE": 8,
		"EVENTDESCRIPTION": "YIELD"
	}, { "CAMEOEVENTCODE": 80, "EVENTDESCRIPTION": "Yield, not specified below " }, {
		"CAMEOEVENTCODE": 81,
		"EVENTDESCRIPTION": "Ease administrative sanctions, not specified below"
	}, { "CAMEOEVENTCODE": 811, "EVENTDESCRIPTION": "Ease restrictions on political freedoms" }, {
		"CAMEOEVENTCODE": 812,
		"EVENTDESCRIPTION": "Ease ban on political parties or politicians"
	}, { "CAMEOEVENTCODE": 813, "EVENTDESCRIPTION": "Ease curfew" }, {
		"CAMEOEVENTCODE": 814,
		"EVENTDESCRIPTION": "Ease state of emergency or martial law"
	}, { "CAMEOEVENTCODE": 82, "EVENTDESCRIPTION": "Ease political dissent " }, {
		"CAMEOEVENTCODE": 83,
		"EVENTDESCRIPTION": "Accede to requests or demands for political reform not specified below"
	}, { "CAMEOEVENTCODE": 831, "EVENTDESCRIPTION": "Accede to demands for change in leadership" }, {
		"CAMEOEVENTCODE": 832,
		"EVENTDESCRIPTION": "Accede to demands for change in policy"
	}, { "CAMEOEVENTCODE": 833, "EVENTDESCRIPTION": "Accede to demands for rights" }, {
		"CAMEOEVENTCODE": 834,
		"EVENTDESCRIPTION": "Accede to demands for change in institutions, regime"
	}, { "CAMEOEVENTCODE": 84, "EVENTDESCRIPTION": "Return, release, not specified below" }, {
		"CAMEOEVENTCODE": 841,
		"EVENTDESCRIPTION": "Return, release person(s)"
	}, { "CAMEOEVENTCODE": 842, "EVENTDESCRIPTION": "Return, release property" }, {
		"CAMEOEVENTCODE": 85,
		"EVENTDESCRIPTION": "Ease economic sanctions, boycott, embargo"
	}, {
		"CAMEOEVENTCODE": 86,
		"EVENTDESCRIPTION": "Allow international involvement not specified below"
	}, { "CAMEOEVENTCODE": 861, "EVENTDESCRIPTION": "Receive deployment of peacekeepers" }, {
		"CAMEOEVENTCODE": 862,
		"EVENTDESCRIPTION": "Receive inspectors"
	}, { "CAMEOEVENTCODE": 863, "EVENTDESCRIPTION": "Allow delivery of humanitarian aid" }, {
		"CAMEOEVENTCODE": 87,
		"EVENTDESCRIPTION": "De-escalate military engagement"
	}, { "CAMEOEVENTCODE": 871, "EVENTDESCRIPTION": "Declare truce, ceasefire" }, {
		"CAMEOEVENTCODE": 872,
		"EVENTDESCRIPTION": "Ease military blockade"
	}, { "CAMEOEVENTCODE": 873, "EVENTDESCRIPTION": "Demobilize armed forces" }, {
		"CAMEOEVENTCODE": 874,
		"EVENTDESCRIPTION": "Retreat or surrender militarily"
	}, { "CAMEOEVENTCODE": 9, "EVENTDESCRIPTION": "INVESTIGATE" }, {
		"CAMEOEVENTCODE": 90,
		"EVENTDESCRIPTION": "Investigate, not specified below"
	}, { "CAMEOEVENTCODE": 91, "EVENTDESCRIPTION": "Investigate crime, corruption" }, {
		"CAMEOEVENTCODE": 92,
		"EVENTDESCRIPTION": "Investigate human rights abuses"
	}, { "CAMEOEVENTCODE": 93, "EVENTDESCRIPTION": "Investigate military action" }, {
		"CAMEOEVENTCODE": 94,
		"EVENTDESCRIPTION": "Investigate war crimes"
	}, { "CAMEOEVENTCODE": 10, "EVENTDESCRIPTION": "DEMAND" }, {
		"CAMEOEVENTCODE": 100,
		"EVENTDESCRIPTION": "Demand, not specified below"
	}, { "CAMEOEVENTCODE": 101, "EVENTDESCRIPTION": "Demand information, investigation" }, {
		"CAMEOEVENTCODE": 1011,
		"EVENTDESCRIPTION": "Demand economic cooperation"
	}, { "CAMEOEVENTCODE": 1012, "EVENTDESCRIPTION": "Demand military cooperation" }, {
		"CAMEOEVENTCODE": 1013,
		"EVENTDESCRIPTION": "Demand judicial cooperation"
	}, { "CAMEOEVENTCODE": 1014, "EVENTDESCRIPTION": "Demand intelligence cooperation" }, {
		"CAMEOEVENTCODE": 102,
		"EVENTDESCRIPTION": "Demand policy support"
	}, { "CAMEOEVENTCODE": 103, "EVENTDESCRIPTION": "Demand aid, protection, or peacekeeping" }, {
		"CAMEOEVENTCODE": 1031,
		"EVENTDESCRIPTION": "Demand economic aid"
	}, { "CAMEOEVENTCODE": 1032, "EVENTDESCRIPTION": "Demand military aid" }, {
		"CAMEOEVENTCODE": 1033,
		"EVENTDESCRIPTION": "Demand humanitarian aid"
	}, {
		"CAMEOEVENTCODE": 1034,
		"EVENTDESCRIPTION": "Demand military protection or peacekeeping"
	}, {
		"CAMEOEVENTCODE": 104,
		"EVENTDESCRIPTION": "Demand political reform, not specified below"
	}, { "CAMEOEVENTCODE": 1041, "EVENTDESCRIPTION": "Demand change in leadership" }, {
		"CAMEOEVENTCODE": 1042,
		"EVENTDESCRIPTION": "Demand policy change"
	}, { "CAMEOEVENTCODE": 1043, "EVENTDESCRIPTION": "Demand rights" }, {
		"CAMEOEVENTCODE": 1044,
		"EVENTDESCRIPTION": "Demand change in institutions, regime"
	}, { "CAMEOEVENTCODE": 105, "EVENTDESCRIPTION": "Demand mediation" }, {
		"CAMEOEVENTCODE": 1051,
		"EVENTDESCRIPTION": "Demand easing of administrative sanctions"
	}, { "CAMEOEVENTCODE": 1052, "EVENTDESCRIPTION": "Demand easing of political dissent" }, {
		"CAMEOEVENTCODE": 1053,
		"EVENTDESCRIPTION": "Demand release of persons or property"
	}, {
		"CAMEOEVENTCODE": 1054,
		"EVENTDESCRIPTION": "Demand easing of economic sanctions, boycott, or embargo"
	}, {
		"CAMEOEVENTCODE": 1055,
		"EVENTDESCRIPTION": "Demand that target allows international involvement (non-mediation)"
	}, {
		"CAMEOEVENTCODE": 1056,
		"EVENTDESCRIPTION": "Demand de-escalation of military engagement106:[-5.0] Demand withdrawal"
	}, { "CAMEOEVENTCODE": 107, "EVENTDESCRIPTION": "Demand ceasefire" }, {
		"CAMEOEVENTCODE": 108,
		"EVENTDESCRIPTION": "Demand meeting, negotiation"
	}, { "CAMEOEVENTCODE": 11, "EVENTDESCRIPTION": "DISAPPROVE" }, {
		"CAMEOEVENTCODE": 110,
		"EVENTDESCRIPTION": "Disapprove, not specified below"
	}, { "CAMEOEVENTCODE": 111, "EVENTDESCRIPTION": "Criticize or denounce " }, {
		"CAMEOEVENTCODE": 112,
		"EVENTDESCRIPTION": "Accuse, not specified below"
	}, { "CAMEOEVENTCODE": 1121, "EVENTDESCRIPTION": "Accuse of crime, corruption" }, {
		"CAMEOEVENTCODE": 1122,
		"EVENTDESCRIPTION": "Accuse of human rights abuses"
	}, { "CAMEOEVENTCODE": 1123, "EVENTDESCRIPTION": "Accuse of aggression" }, {
		"CAMEOEVENTCODE": 1124,
		"EVENTDESCRIPTION": "Accuse of war crimes"
	}, { "CAMEOEVENTCODE": 1125, "EVENTDESCRIPTION": "Accuse of espionage, treason" }, {
		"CAMEOEVENTCODE": 113,
		"EVENTDESCRIPTION": "Rally opposition against"
	}, { "CAMEOEVENTCODE": 114, "EVENTDESCRIPTION": "Complain officially " }, {
		"CAMEOEVENTCODE": 115,
		"EVENTDESCRIPTION": "Bring lawsuit against "
	}, { "CAMEOEVENTCODE": 116, "EVENTDESCRIPTION": "Find guilty or liable (legally)" }, {
		"CAMEOEVENTCODE": 12,
		"EVENTDESCRIPTION": "REJECT"
	}, { "CAMEOEVENTCODE": 120, "EVENTDESCRIPTION": "Reject, not specified below" }, {
		"CAMEOEVENTCODE": 121,
		"EVENTDESCRIPTION": "Reject material cooperation"
	}, { "CAMEOEVENTCODE": 1211, "EVENTDESCRIPTION": "Reject economic cooperation" }, {
		"CAMEOEVENTCODE": 1212,
		"EVENTDESCRIPTION": "Reject military cooperation"
	}, {
		"CAMEOEVENTCODE": 122,
		"EVENTDESCRIPTION": "Reject request or demand for material aid, not specified below"
	}, { "CAMEOEVENTCODE": 1221, "EVENTDESCRIPTION": "Reject request for economic aid" }, {
		"CAMEOEVENTCODE": 1222,
		"EVENTDESCRIPTION": "Reject request for military aid"
	}, { "CAMEOEVENTCODE": 1223, "EVENTDESCRIPTION": "Reject request for humanitarian aid" }, {
		"CAMEOEVENTCODE": 1224,
		"EVENTDESCRIPTION": "Reject request for military protection or peacekeeping"
	}, {
		"CAMEOEVENTCODE": 123,
		"EVENTDESCRIPTION": "Reject request or demand for political reform, not specified below"
	}, { "CAMEOEVENTCODE": 1231, "EVENTDESCRIPTION": "Reject request for change in leadership" }, {
		"CAMEOEVENTCODE": 1232,
		"EVENTDESCRIPTION": "Reject request for policy change"
	}, { "CAMEOEVENTCODE": 1233, "EVENTDESCRIPTION": "Reject request for rights" }, {
		"CAMEOEVENTCODE": 1234,
		"EVENTDESCRIPTION": "Reject request for change in institutions, regime"
	}, { "CAMEOEVENTCODE": 124, "EVENTDESCRIPTION": "Refuse to yield, not specified below" }, {
		"CAMEOEVENTCODE": 1241,
		"EVENTDESCRIPTION": "Refuse to ease administrative sanctions"
	}, { "CAMEOEVENTCODE": 1242, "EVENTDESCRIPTION": "Refuse to ease popular dissent" }, {
		"CAMEOEVENTCODE": 1243,
		"EVENTDESCRIPTION": "Refuse to release persons or property"
	}, {
		"CAMEOEVENTCODE": 1244,
		"EVENTDESCRIPTION": "Refuse to ease economic sanctions, boycott, or embargo"
	}, {
		"CAMEOEVENTCODE": 1245,
		"EVENTDESCRIPTION": "Refuse to allow international involvement (non mediation)"
	}, { "CAMEOEVENTCODE": 1246, "EVENTDESCRIPTION": "Refuse to de-escalate military engagement" }, {
		"CAMEOEVENTCODE": 125,
		"EVENTDESCRIPTION": "Reject proposal to meet, discuss, or negotiate"
	}, { "CAMEOEVENTCODE": 126, "EVENTDESCRIPTION": "Reject mediation" }, {
		"CAMEOEVENTCODE": 127,
		"EVENTDESCRIPTION": "Reject plan, agreement to settle dispute"
	}, { "CAMEOEVENTCODE": 128, "EVENTDESCRIPTION": "Defy norms, law" }, {
		"CAMEOEVENTCODE": 129,
		"EVENTDESCRIPTION": "Veto"
	}, { "CAMEOEVENTCODE": 13, "EVENTDESCRIPTION": "THREATEN" }, {
		"CAMEOEVENTCODE": 130,
		"EVENTDESCRIPTION": "Threaten, not specified below"
	}, { "CAMEOEVENTCODE": 131, "EVENTDESCRIPTION": "Threaten non-force, not specified below" }, {
		"CAMEOEVENTCODE": 1311,
		"EVENTDESCRIPTION": "Threaten to reduce or stop aid"
	}, {
		"CAMEOEVENTCODE": 1312,
		"EVENTDESCRIPTION": "Threaten to boycott, embargo, or sanction"
	}, { "CAMEOEVENTCODE": 1313, "EVENTDESCRIPTION": "Threaten to reduce or break relations" }, {
		"CAMEOEVENTCODE": 132,
		"EVENTDESCRIPTION": "Threaten with administrative sanctions, not specified below"
	}, {
		"CAMEOEVENTCODE": 1321,
		"EVENTDESCRIPTION": "Threaten to impose restrictions on political freedoms "
	}, {
		"CAMEOEVENTCODE": 1322,
		"EVENTDESCRIPTION": "Threaten to ban political parties or politicians"
	}, { "CAMEOEVENTCODE": 1323, "EVENTDESCRIPTION": "Threaten to impose curfew" }, {
		"CAMEOEVENTCODE": 1324,
		"EVENTDESCRIPTION": "Threaten to impose state of emergency or martial law"
	}, { "CAMEOEVENTCODE": 133, "EVENTDESCRIPTION": "Threaten political dissent, protest" }, {
		"CAMEOEVENTCODE": 134,
		"EVENTDESCRIPTION": "Threaten to halt negotiations"
	}, { "CAMEOEVENTCODE": 135, "EVENTDESCRIPTION": "Threaten to halt mediation" }, {
		"CAMEOEVENTCODE": 136,
		"EVENTDESCRIPTION": "Threaten to halt international involvement (non-mediation)"
	}, { "CAMEOEVENTCODE": 137, "EVENTDESCRIPTION": "Threaten with violent repression" }, {
		"CAMEOEVENTCODE": 138,
		"EVENTDESCRIPTION": "Threaten to use military force, not specified below"
	}, { "CAMEOEVENTCODE": 1381, "EVENTDESCRIPTION": "Threaten blockade" }, {
		"CAMEOEVENTCODE": 1382,
		"EVENTDESCRIPTION": "Threaten occupation "
	}, { "CAMEOEVENTCODE": 1383, "EVENTDESCRIPTION": "Threaten unconventional violence " }, {
		"CAMEOEVENTCODE": 1384,
		"EVENTDESCRIPTION": "Threaten conventional attack "
	}, { "CAMEOEVENTCODE": 1385, "EVENTDESCRIPTION": "Threaten attack with WMD" }, {
		"CAMEOEVENTCODE": 139,
		"EVENTDESCRIPTION": "Give ultimatum"
	}, { "CAMEOEVENTCODE": 14, "EVENTDESCRIPTION": "PROTEST" }, {
		"CAMEOEVENTCODE": 140,
		"EVENTDESCRIPTION": "Engage in political dissent, not specified below"
	}, { "CAMEOEVENTCODE": 141, "EVENTDESCRIPTION": "Demonstrate or rally" }, {
		"CAMEOEVENTCODE": 1411,
		"EVENTDESCRIPTION": "Demonstrate for leadership change"
	}, { "CAMEOEVENTCODE": 1412, "EVENTDESCRIPTION": "Demonstrate for policy change" }, {
		"CAMEOEVENTCODE": 1413,
		"EVENTDESCRIPTION": "Demonstrate for rights"
	}, {
		"CAMEOEVENTCODE": 1414,
		"EVENTDESCRIPTION": "Demonstrate for change in institutions, regime"
	}, {
		"CAMEOEVENTCODE": 142,
		"EVENTDESCRIPTION": "Conduct hunger strike, not specified below"
	}, {
		"CAMEOEVENTCODE": 1421,
		"EVENTDESCRIPTION": "Conduct hunger strike for leadership change"
	}, { "CAMEOEVENTCODE": 1422, "EVENTDESCRIPTION": "Conduct hunger strike for policy change" }, {
		"CAMEOEVENTCODE": 1423,
		"EVENTDESCRIPTION": "Conduct hunger strike for rights"
	}, {
		"CAMEOEVENTCODE": 1424,
		"EVENTDESCRIPTION": "Conduct hunger strike for change in institutions, regime "
	}, {
		"CAMEOEVENTCODE": 143,
		"EVENTDESCRIPTION": "Conduct strike or boycott, not specified below"
	}, {
		"CAMEOEVENTCODE": 1431,
		"EVENTDESCRIPTION": "Conduct strike or boycott for leadership change "
	}, {
		"CAMEOEVENTCODE": 1432,
		"EVENTDESCRIPTION": "Conduct strike or boycott for policy change"
	}, { "CAMEOEVENTCODE": 1433, "EVENTDESCRIPTION": "Conduct strike or boycott for rights" }, {
		"CAMEOEVENTCODE": 1434,
		"EVENTDESCRIPTION": "Conduct strike or boycott for change in institutions, regime"
	}, { "CAMEOEVENTCODE": 144, "EVENTDESCRIPTION": "Obstruct passage, block" }, {
		"CAMEOEVENTCODE": 1441,
		"EVENTDESCRIPTION": "Obstruct passage to demand leadership change "
	}, { "CAMEOEVENTCODE": 1442, "EVENTDESCRIPTION": "Obstruct passage to demand policy change" }, {
		"CAMEOEVENTCODE": 1443,
		"EVENTDESCRIPTION": "Obstruct passage to demand rights"
	}, {
		"CAMEOEVENTCODE": 1444,
		"EVENTDESCRIPTION": "Obstruct passage to demand change in institutions, regime"
	}, { "CAMEOEVENTCODE": 145, "EVENTDESCRIPTION": "Protest violently, riot" }, {
		"CAMEOEVENTCODE": 1451,
		"EVENTDESCRIPTION": "Engage in violent protest for leadership change "
	}, {
		"CAMEOEVENTCODE": 1452,
		"EVENTDESCRIPTION": "Engage in violent protest for policy change"
	}, { "CAMEOEVENTCODE": 1453, "EVENTDESCRIPTION": "Engage in violent protest for rights" }, {
		"CAMEOEVENTCODE": 1454,
		"EVENTDESCRIPTION": "Engage in violent protest for change in institutions, regime"
	}, { "CAMEOEVENTCODE": 15, "EVENTDESCRIPTION": "EXHIBIT FORCE POSTURE" }, {
		"CAMEOEVENTCODE": 150,
		"EVENTDESCRIPTION": "Demonstrate military or police power, not specified below"
	}, { "CAMEOEVENTCODE": 151, "EVENTDESCRIPTION": "Increase police alert status" }, {
		"CAMEOEVENTCODE": 152,
		"EVENTDESCRIPTION": "Increase military alert status"
	}, { "CAMEOEVENTCODE": 153, "EVENTDESCRIPTION": "Mobilize or increase police power" }, {
		"CAMEOEVENTCODE": 154,
		"EVENTDESCRIPTION": "Mobilize or increase armed forces "
	}, { "CAMEOEVENTCODE": 16, "EVENTDESCRIPTION": "REDUCE RELATIONS" }, {
		"CAMEOEVENTCODE": 160,
		"EVENTDESCRIPTION": "Reduce relations, not specified below"
	}, { "CAMEOEVENTCODE": 161, "EVENTDESCRIPTION": "Reduce or break diplomatic relations" }, {
		"CAMEOEVENTCODE": 162,
		"EVENTDESCRIPTION": "Reduce or stop aid, not specified below"
	}, { "CAMEOEVENTCODE": 1621, "EVENTDESCRIPTION": "Reduce or stop economic assistance" }, {
		"CAMEOEVENTCODE": 1622,
		"EVENTDESCRIPTION": "Reduce or stop military assistance"
	}, { "CAMEOEVENTCODE": 1623, "EVENTDESCRIPTION": "Reduce or stop humanitarian assistance" }, {
		"CAMEOEVENTCODE": 163,
		"EVENTDESCRIPTION": "Impose embargo, boycott, or sanctions"
	}, { "CAMEOEVENTCODE": 164, "EVENTDESCRIPTION": "Halt negotiations" }, {
		"CAMEOEVENTCODE": 165,
		"EVENTDESCRIPTION": "Halt mediation"
	}, { "CAMEOEVENTCODE": 166, "EVENTDESCRIPTION": "Expel or withdraw, not specified below" }, {
		"CAMEOEVENTCODE": 1661,
		"EVENTDESCRIPTION": "Expel or withdraw peacekeepers"
	}, { "CAMEOEVENTCODE": 1662, "EVENTDESCRIPTION": "Expel or withdraw inspectors, observers" }, {
		"CAMEOEVENTCODE": 1663,
		"EVENTDESCRIPTION": "Expel or withdraw aid agencies"
	}, { "CAMEOEVENTCODE": 17, "EVENTDESCRIPTION": "COERCE" }, {
		"CAMEOEVENTCODE": 170,
		"EVENTDESCRIPTION": "Coerce, not specified below "
	}, {
		"CAMEOEVENTCODE": 171,
		"EVENTDESCRIPTION": "Seize or damage property, not specified below"
	}, { "CAMEOEVENTCODE": 1711, "EVENTDESCRIPTION": "Confiscate property" }, {
		"CAMEOEVENTCODE": 1712,
		"EVENTDESCRIPTION": "Destroy property"
	}, {
		"CAMEOEVENTCODE": 172,
		"EVENTDESCRIPTION": "Impose administrative sanctions, not specified below"
	}, {
		"CAMEOEVENTCODE": 1721,
		"EVENTDESCRIPTION": "Impose restrictions on political freedoms "
	}, { "CAMEOEVENTCODE": 1722, "EVENTDESCRIPTION": "Ban political parties or politicians" }, {
		"CAMEOEVENTCODE": 1723,
		"EVENTDESCRIPTION": "Impose curfew"
	}, { "CAMEOEVENTCODE": 1724, "EVENTDESCRIPTION": "Impose state of emergency or martial law" }, {
		"CAMEOEVENTCODE": 173,
		"EVENTDESCRIPTION": "Arrest, detain, or charge with legal action "
	}, { "CAMEOEVENTCODE": 174, "EVENTDESCRIPTION": "Expel or deport individuals" }, {
		"CAMEOEVENTCODE": 175,
		"EVENTDESCRIPTION": "Use tactics of violent repression "
	}, { "CAMEOEVENTCODE": 18, "EVENTDESCRIPTION": "ASSAULT" }, {
		"CAMEOEVENTCODE": 180,
		"EVENTDESCRIPTION": "Use unconventional violence, not specified below"
	}, { "CAMEOEVENTCODE": 181, "EVENTDESCRIPTION": "Abduct, hijack, or take hostage " }, {
		"CAMEOEVENTCODE": 182,
		"EVENTDESCRIPTION": "Physically assault, not specified below"
	}, { "CAMEOEVENTCODE": 1821, "EVENTDESCRIPTION": "Sexually assault" }, {
		"CAMEOEVENTCODE": 1822,
		"EVENTDESCRIPTION": "Torture"
	}, { "CAMEOEVENTCODE": 1823, "EVENTDESCRIPTION": "Kill by physical assault" }, {
		"CAMEOEVENTCODE": 183,
		"EVENTDESCRIPTION": "Conduct suicide, car, or other non-military bombing, not spec below"
	}, { "CAMEOEVENTCODE": 1831, "EVENTDESCRIPTION": "Carry out suicide bombing" }, {
		"CAMEOEVENTCODE": 1832,
		"EVENTDESCRIPTION": "Carry out car bombing"
	}, { "CAMEOEVENTCODE": 1833, "EVENTDESCRIPTION": "Carry out roadside bombing " }, {
		"CAMEOEVENTCODE": 184,
		"EVENTDESCRIPTION": "Use as human shield "
	}, { "CAMEOEVENTCODE": 185, "EVENTDESCRIPTION": "Attempt to assassinate" }, {
		"CAMEOEVENTCODE": 186,
		"EVENTDESCRIPTION": "Assassinate "
	}, { "CAMEOEVENTCODE": 19, "EVENTDESCRIPTION": "FIGHT" }, {
		"CAMEOEVENTCODE": 190,
		"EVENTDESCRIPTION": "Use conventional military force, not specified below"
	}, { "CAMEOEVENTCODE": 191, "EVENTDESCRIPTION": "Impose blockade, restrict movement " }, {
		"CAMEOEVENTCODE": 192,
		"EVENTDESCRIPTION": "Occupy territory"
	}, { "CAMEOEVENTCODE": 193, "EVENTDESCRIPTION": "Fight with small arms and light weapons" }, {
		"CAMEOEVENTCODE": 194,
		"EVENTDESCRIPTION": "Fight with artillery and tanks"
	}, { "CAMEOEVENTCODE": 195, "EVENTDESCRIPTION": "Employ aerial weapons" }, {
		"CAMEOEVENTCODE": 196,
		"EVENTDESCRIPTION": "Violate ceasefire "
	}, { "CAMEOEVENTCODE": 20, "EVENTDESCRIPTION": "USE UNCONVENTIONAL MASS VIOLENCE" }, {
		"CAMEOEVENTCODE": 200,
		"EVENTDESCRIPTION": "Use unconventional mass violence, not specified below"
	}, { "CAMEOEVENTCODE": 201, "EVENTDESCRIPTION": "Engage in mass expulsion" }, {
		"CAMEOEVENTCODE": 202,
		"EVENTDESCRIPTION": "Engage in mass killings"
	}, { "CAMEOEVENTCODE": 203, "EVENTDESCRIPTION": "Engage in ethnic cleansing" }, {
		"CAMEOEVENTCODE": 204,
		"EVENTDESCRIPTION": "Use weapons of mass destruction, not specified below"
	}, {
		"CAMEOEVENTCODE": 2041,
		"EVENTDESCRIPTION": "Use chemical, biological, or radiologicalweapons"
	}, { "CAMEOEVENTCODE": 2042, "EVENTDESCRIPTION": "Detonate nuclear weapons" }];

let remainder = "", acc = {};
process.stdin.on("readable", () => {

	let chunk;

	while ((chunk = process.stdin.read()) !== null) { // TODO: this does no back pressuring (will just fill memory)
		const string = remainder + chunk.toString();
		const units = string.split("\n");
		// console.log(JSON.parse(units[0]))
		remainder = units.splice(-1, 1)[0]; // if it doesn't contain a final delimiter, keep the last chunk

		units.forEach(unit => {

			try {
				let [
					date,
					Source,
					Target,
					CAMEOCode,
					NumEvents,
					NumArts,
					QuadClass,
					Goldstein,
					SourceGeoType,
					SourceGeoLat,
					SourceGeoLong,
					TargetGeoType,
					TargetGeoLat,
					TargetGeoLong,
					ActionGeoType,
					ActionGeoLat,
					ActionGeoLong
				] = unit.split("\t");

				NumEvents = parseInt(NumEvents, 10);


				if (date === "Date") return; // its the header row

				const year = date.slice(0, 4);
				const month = date.slice(4, 6);
				const day = date.slice(6, 8);

				const dateObj = new Date();
				dateObj.setFullYear(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10));
				dateObj.setHours(0, 0, 0, 0);
				// console.log(acc,dateObj);

				const index = codeLookups.findIndex(({ CAMEOEVENTCODE }) => CAMEOCode === CAMEOEVENTCODE.toString());
				if (index !== -1) {
					const { EVENTDESCRIPTION } = codeLookups[index];
					acc[EVENTDESCRIPTION] = acc[EVENTDESCRIPTION] || 0;
					acc[EVENTDESCRIPTION]++;
				}
			}
			catch (e) {
				console.log(unit);
				console.log("error", e);
				process.exit(1);
			}
		});

	}
});

process.stdin.on("end", () => {
	console.log(JSON.stringify(acc, null, 2));
	process.exit(0);
});
