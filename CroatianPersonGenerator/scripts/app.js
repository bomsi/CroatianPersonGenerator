/**
 * Birth place.
 */
var BirthPlace = /** @class */ (function () {
    function BirthPlace(cityName, politicalRegionCode) {
        this.cityName = cityName;
        this.politicalRegionCode = politicalRegionCode;
    }
    return BirthPlace;
}());
/**
 * Sample data.
 */
var SampleData = /** @class */ (function () {
    function SampleData() {
        this.femaleNames = new Array();
        this.maleNames = new Array();
        this.surnames = new Array();
        this.birthPlaces = new Array();
        this.femaleNames.push("Ivana", "Ana", "Petra", "Marija", "Lucija", "Martina", "Nikolina", "Matea", "Sara", "Marina", "Sanja");
        this.maleNames.push("Ivan", "Luka", "Marko", "Josip", "Filip", "Antonio", "Tomislav", "Karlo", "Matija", "Nikola", "Matej", "Mario");
        this.surnames.push("Horvat", "Kovačević", "Babić", "Jurić", "Marić", "Novak", "Matić", "Knežević", "Vuković", "Tomić", "Kovačić");
        this.birthPlaces.push(new BirthPlace("Zagreb", 33));
        this.birthPlaces.push(new BirthPlace("Split", 38), new BirthPlace("Dubrovnik", 38), new BirthPlace("Sinj", 38), new BirthPlace("Metković", 38), new BirthPlace("Makarska", 38), new BirthPlace("Imotski", 38), new BirthPlace("Supetar", 38));
        this.birthPlaces.push(new BirthPlace("Osijek", 30), new BirthPlace("Vinkovci", 30), new BirthPlace("Našice", 30), new BirthPlace("Slavonski Brod", 30), new BirthPlace("Vukovar", 30), new BirthPlace("Đakovo", 30));
        this.birthPlaces.push(new BirthPlace("Rijeka", 36), new BirthPlace("Pula", 36), new BirthPlace("Mali Lošinj", 36));
        this.birthPlaces.push(new BirthPlace("Varaždin", 32), new BirthPlace("Čakovec", 32));
        this.birthPlaces.push(new BirthPlace("Koprivnica", 31), new BirthPlace("Virovitica", 31), new BirthPlace("Bjelovar", 31), new BirthPlace("Pakrac", 31), new BirthPlace("Našice", 31));
        this.birthPlaces.push(new BirthPlace("Zadar", 37), new BirthPlace("Šibenik", 37), new BirthPlace("Gospić", 37), new BirthPlace("Knin", 37));
        this.birthPlaces.push(new BirthPlace("Karlovac", 34), new BirthPlace("Sisak", 34));
        this.birthPlaces.push(new BirthPlace("Slavonski Brod", 35), new BirthPlace("Nova Gradiška", 35));
        this.birthPlaces.push(new BirthPlace("Zabok", 39), new BirthPlace("Kutina", 39));
    }
    return SampleData;
}());
/**
 * Random number generator.
 */
var RandomNumberGenerator = /** @class */ (function () {
    function RandomNumberGenerator() {
    }
    /**
    * Returns a pseudo-random number.
    * @param from Inclusive minimum.
    * @param to Exclusive maximum.
    */
    RandomNumberGenerator.next = function (from, to) {
        from = Math.ceil(from);
        to = Math.floor(to);
        return Math.floor(Math.random() * (to - from)) + from;
    };
    return RandomNumberGenerator;
}());
/**
 * A random Croatian person.
 */
var CroatianPerson = /** @class */ (function () {
    function CroatianPerson(data) {
        this.gender = RandomNumberGenerator.next(0, 2) === 0;
        this.name = this.gender ? data.maleNames[RandomNumberGenerator.next(0, data.maleNames.length)] : data.femaleNames[RandomNumberGenerator.next(0, data.femaleNames.length)];
        this.surname = data.surnames[RandomNumberGenerator.next(0, data.surnames.length)];
        this.oib = this.generateOib();
        this.birthPlace = data.birthPlaces[RandomNumberGenerator.next(0, data.birthPlaces.length)];
        this.birthDate = new Date(RandomNumberGenerator.next(1970, 2010), RandomNumberGenerator.next(1, 13), RandomNumberGenerator.next(1, 29));
        this.jmbg = this.generateJmbg(this.birthDate, this.birthPlace, this.gender);
    }
    /**
     * Generate a valid OIB. OIB is a string of 10 random digits followed by a control digit which is
     * calculated using ISO 7064, MOD 11,10.
     */
    CroatianPerson.prototype.generateOib = function () {
        var oib = "";
        var oibDigits = new Array(11);
        var t = 10;
        for (var i = 0; i < 10; ++i) {
            oibDigits[i] = RandomNumberGenerator.next(0, 10);
            oib += oibDigits[i].toString();
            t += oibDigits[i];
            t %= 10;
            if (t === 0)
                t = 10;
            t *= 2;
            t %= 11;
        }
        var controlNumber = 11 - t;
        if (controlNumber === 10)
            controlNumber = 0;
        oibDigits[10] = controlNumber;
        oib += controlNumber.toString();
        return oib;
    };
    /**
     * Generate a valid JMBG. JMBG is a string of digits in the following format: DDMMYYYRRBBBK.
     * @param birthDate date of birth
     * @param birthPlace place of birth
     * @param gender gender at birth
     */
    CroatianPerson.prototype.generateJmbg = function (birthDate, birthPlace, gender) {
        var jmbg = "";
        // DD - day of birth
        jmbg += birthDate.getUTCDate() < 10 ? "0" + birthDate.getUTCDate().toString() : birthDate.getUTCDate().toString();
        // MM - month of birth
        jmbg += (birthDate.getUTCMonth() + 1) < 10 ? "0" + (birthDate.getUTCMonth() + 1).toString() :
            (birthDate.getUTCMonth() + 1).toString();
        // YYY - last three digits of the year of birth
        jmbg += birthDate.getUTCFullYear().toString().substr(1, 3);
        // RR - political region of birth or first registration
        jmbg += birthPlace.politicalRegionCode.toString();
        // BBB - unique number, represents a person within the DDMMYYYRR section in the particular municipality
        var uniqueNumberInRegion = RandomNumberGenerator.next(0, 500);
        // 0 - 499: male range
        // 500 - 999: female range
        if (!gender)
            uniqueNumberInRegion += 500;
        if (uniqueNumberInRegion < 100)
            jmbg += "0";
        if (uniqueNumberInRegion < 10)
            jmbg += "0";
        jmbg += uniqueNumberInRegion.toString();
        var jmbgDigits = new Array(12);
        for (var i = 0; i < 13; ++i)
            jmbgDigits[i] = parseInt(jmbg[i]);
        // K - control digit
        var controlDigit = 11 - ((7 * (jmbgDigits[0] + jmbgDigits[6]) +
            6 * (jmbgDigits[1] + jmbgDigits[7]) +
            5 * (jmbgDigits[2] + jmbgDigits[8]) +
            4 * (jmbgDigits[3] + jmbgDigits[9]) +
            3 * (jmbgDigits[4] + jmbgDigits[10]) +
            2 * (jmbgDigits[5] + jmbgDigits[11])) % 11);
        if (controlDigit > 9)
            controlDigit = 0;
        jmbg += controlDigit.toString();
        return jmbg;
    };
    return CroatianPerson;
}());
/**
 * Generates random Croatian person.
 */
function generateCroatianPerson() {
    var person = new CroatianPerson(new SampleData());
    document.getElementById("name").textContent = person.name;
    document.getElementById("surname").textContent = person.surname;
    document.getElementById("oib").textContent = person.oib;
    document.getElementById("jmbg").textContent = person.jmbg;
    document.getElementById("gender").textContent = person.gender ? "Male" : "Female";
    document.getElementById("birthPlace").textContent = person.birthPlace.cityName;
    // format date for display:
    var birthDate = person.birthDate.getUTCFullYear().toString() + "-";
    birthDate += (person.birthDate.getUTCMonth() + 1) < 10 ?
        "0" + (person.birthDate.getUTCMonth() + 1).toString() : (person.birthDate.getUTCMonth() + 1).toString();
    birthDate += "-";
    birthDate += person.birthDate.getUTCDate() < 10 ? "0" + person.birthDate.getUTCDate().toString() : person.birthDate.getUTCDate().toString();
    document.getElementById("birthDate").textContent = birthDate;
}
//# sourceMappingURL=app.js.map