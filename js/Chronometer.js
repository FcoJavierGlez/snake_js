/**
 * @author Francisco Javier González Sabariego
 */

class Chronometer {
    static #MAX_SECONDS_PER_DAY = 86400;

    #seconds = 0;
    #idPlay  = 0;

    constructor(time) {
        this.#setTime(time);
    }

    getTime = function() {
        const [hours,minutes,seconds] = [
            this.#seconds >= 3600 ? parseInt(this.#seconds/3600) % 60 : 0,
            this.#seconds >= 60 ? parseInt(this.#seconds/60) % 60 : 0,
            this.#seconds % 60
        ];
        return `${this.#formatTime(hours)}:${this.#formatTime(minutes)}:${this.#formatTime(seconds)}`;
    }

    togglePause = function() {
        this.#idPlay == 0 ? (this.#idPlay = this.#play()) : this.#pause();
    }

    #play = function() {
        let chrono = this;
        return setInterval(
            () => {
                ++chrono.#seconds;
                chrono.#seconds %= Chronometer.#MAX_SECONDS_PER_DAY;
            } , 1000);
    }

    #pause = function() {
        clearInterval(this.#idPlay);
        this.#idPlay = 0;
    };

    #setTime = function(time) {
        if (isNaN(time))
            this.#setTimeFromFormat(time);
        else
            this.#seconds = parseInt(time) % Chronometer.#MAX_SECONDS_PER_DAY;
    }

    #setTimeFromFormat = function(time) {
        const REGEXP_TIME = /^(?<hours>[0-1]\d|2[0-3]):(?<minutes>0\d|[1-5]\d):(?<seconds>0\d|[1-5]\d)$/;
        const {groups: {hours,minutes,seconds}} = time.match(REGEXP_TIME);
        this.#seconds = (parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)) % Chronometer.#MAX_SECONDS_PER_DAY;
    }

    #formatTime = digit => digit < 10 ? `0${digit}` : digit;
}