const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Nevada",
            singer: "Vicetone",
            path: "./music/Vicetone - Nevada (feat. Cozi Zuehlsdorff) [Monstercat Official Music Video].mp3",
            image: "./img/Vicetone - Nevada (feat. Cozi Zuehlsdorff).jpg",
        },
        {
            name: "SummerTime",
            singer: "K-391",
            path: "./music/K-391 - Summertime [Sunshine].mp3",
            image: "./img/K-391 - Summertime [Sunshine].jpg",
        },
        {
            name: "Monody",
            singer: "TheFatRat",
            path: "./music/TheFatRat - Monody (feat. Laura Brehm).mp3",
            image: "./img/TheFatRat (feat. Laura Brehm) - Khúc Tiễn Biệt (Monody).jpg",
        },
        {
            name: "Reality",
            singer: "Lost Frequencies",
            path: "./music/Reality - Lost Frequencies.mp3",
            image: "./img/Reality - Lost Frequencies.jpg",
        },
        {
            name: "Jumbo",
            singer: "Alex Skrindo",
            path: "./music/Alex Skrindo - Jumbo - House - NCS - Copyright Free Music.mp3",
            image: "./img/Alex Skrindo - Jumbo - House - NCS - Copyright Free Music.jpg",
        },
        {
            name: "Be Together",
            singer: "Zaza",
            path: "./music/Zaza - Be Together - Electronic - NCS - Copyright Free Music.mp3",
            image: "./img/Zaza - Be Together - Electronic - NCS - Copyright Free Music.jpg",
        },
        {
            name: "Limitless",
            singer: "Elektronomia",
            path: "./music/Elektronomia - Limitless - Progressive House - NCS - Copyright Free Music.mp3",
            image: "./img/Elektronomia - Limitless - Progressive House - NCS - Copyright Free Music.jpg",
        },
    ],
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}">
                <div
                    class="thumb"
                    style="background-image: url('${song.image}');"
                ></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`;
        });
        $(".playlist").innerHTML = htmls.join("\n");
    },
    handleEvents: function () {
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay
        const cdThumbAnimate = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );

        cdThumbAnimate.pause();

        // Xử lý phóng to thu nhỏ
        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;

            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Xử lý khi play
        playBtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // Khi song play
        audio.onplay = function () {
            app.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

        // Khi song pause
        audio.onpause = function () {
            app.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // Khi thời gian chạy bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };

        // Xử lý khi tua xong
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        // Khi next song
        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        };

        // Khi prev song
        prevBtn.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        };

        // Khi random song
        randomBtn.onclick = function () {
            if (app.isRepeat) {
                repeatBtn.classList.remove("active");
                app.isRepeat = false;
            }
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle("active", app.isRandom);
        };

        // Khi repeat song
        repeatBtn.onclick = function () {
            if (app.isRandom) {
                randomBtn.classList.remove("active");
                app.isRandom = false;
            }
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle("active", app.isRepeat);
        };

        // Khi audio end
        audio.onended = function () {
            if (app.isRepeat) {
                app.loadCurrentSong();
                audio.play();
            } else {
                nextBtn.click();
            }
        };
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        app.currentIndex++;
        if (app.currentIndex >= app.songs.length) {
            app.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        app.currentIndex--;
        if (app.currentIndex < 0) {
            app.currentIndex = app.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let curIndexSong = app.currentIndex;
        let newIndexSong;
        do {
            newIndexSong = Math.floor(Math.random() * this.songs.length);
        } while (newIndexSong === curIndexSong);
        app.currentIndex = newIndexSong;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 100)
    },
    start: function () {
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();  
    },
};

app.start();
