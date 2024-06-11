(()=>{
  // поиск элемента списка ul
  const game = document.querySelector('.game__list');
  // предназначены для хранения информации о том, какие карточки в данный момент открыты
  // null - пустое значение
  let cardOne = null;
  let cardTwo = null;
  let timer; // Переменная для хранения идентификатора таймера
  let timeLeft; // Переменная для хранения оставшегося времени

  // элементы кнопки и инпута и таймера
  const pairsInput = document.getElementById('pairs-input');
  const startButton = document.getElementById('start-button');
  const timerInput = document.getElementById('game-timer-input');
  const timerDisplay = document.getElementById('timer');
  // кнопка начать игру
  startButton.addEventListener('click', () => {
    // значения count
    // parseInt берёт строковое знвечние напрмер "4" и преобразовывает его в целое число
    let count = parseInt(pairsInput.value);
    // получение значения таймера из ввода
    let timerValue = parseInt(timerInput.value);
    // проверка ввода значения таймера
    if (isNaN(timerValue) || timerValue <= 0 || timerValue >= 300) {
      timerValue = 63; // Устанавливаем таймер по умолчанию на 60 секунд
    }
    // передаём после проверки в функцию startGame(count, timerValue)
    // Передает количество пар карточек и время в функцию startGame, которая запускает игру.
    startGame(count, timerValue);
  });

  // функция генерирующую массив парных чисел.
  function createNumbersArray(count) {
    const arrNumber = [];
    for (let i = 1; i <= count; i++) {
      arrNumber.push(i, i); // Добавляем каждое число дважды
    }
    return arrNumber; // Возвращаем массив
  }

  // перемешивания массива
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Обмен значениями с использованием временной переменной
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr; // Возвращаем перемешанный массив
  }

  // функция для обновления и отображения таймера
  function updateTimer() {
    // Math.floor(timeLeft / 60) — деление оставшегося времени на 60 и округление вниз
    // до ближайшего целого числа, чтобы получить количество минут.
    // timeLeft % 60 — это вычисление остатка от деления оставшегося времени на 60,
    // чтобы получить количество секунд.
    // timeLeft % 60 — это вычисление остатка от деления оставшегося времени на 60,
    // чтобы получить количество секунд.
    // ('0' + (timeLeft % 60)) — добавление нуля к числу секунд, чтобы обеспечить,
    // что всегда будет две цифры
    // .slice(-2) — извлечение последних двух символов из строки,
    // чтобы получить корректный формат секунд
    timerDisplay.textContent = `Время: ${Math.floor(timeLeft / 60)}:${('0' + (timeLeft % 60)).slice(-2)}`;
    // Это условие проверяет, осталось ли еще время для игры.
    // Переменная timeLeft хранит количество секунд, оставшихся до завершения игры
    // Если timeLeft больше нуля, то время еще не истекло, и игра продолжается
    if(timeLeft > 0) {
      // Если время еще не истекло, уменьшаем значение переменной timeLeft на 1 секунду
      timeLeft--;
      // если истекло то clearInterval(timer); — останавливает таймер,
      // чтобы он больше не вызывал функцию updateTimer() каждую секунду
    }else {
      clearInterval(timer);
      alert("Время вышло! Игра окончена.");
      game.innerHTML = ''; // Очищаем поле игры при завершении
    }
  }

  // функции для показа и скрытия карточек
    // Показывает все карточки
  function showAllCards() {
    const cards = document.querySelectorAll('.game__item-card');
    // Метод forEach начинает проходить по всем элементам в cards.
    cards.forEach(card => {
      card.classList.add('game__card--appearance');
      card.querySelector('.game__card-number--question').style.display = 'none';
    });
  }

  // Скрывает все карточки
  function hideAllCards() {
    const cards = document.querySelectorAll('.game__item-card');
    // Метод forEach начинает проходить по всем элементам в cards.
    cards.forEach(card => {
      card.classList.remove('game__card--appearance');
      card.querySelector('.game__card-number--question').style.display = 'block';
    });
  }


  // создание функции с игрой
  // startGame принимает значение count и выводит каточки
  function startGame(count, timerValue) {
    // берём наши сгенирированные числа и перемешиваем их
    const pairsNumber = createNumbersArray(count);
    const gamePairs = shuffle(pairsNumber);
    // очищаем поле для воода
    // game.innerHTML = '';: Эта строка очищает содержимое элемента с классом
    // .game__list, обнуляя его содержимое. Это нужно для того, чтобы перед началом
    // новой игры удалить все предыдущие карточки из списка.
    game.innerHTML = '';

    // инициализация таймера
    clearInterval(timer); // Останавливаем предыдущий таймер, если он был запущен
    timeLeft = timerValue; // Устанавливаем оставшееся время
    timer = setInterval(updateTimer, 1000); // Запускаем таймер с обновлением каждую секунду
    updateTimer(); // Обновляем отображение таймера сразу после начала игры

    // Создание карточек
    for (const cardNumber of gamePairs) {
      const li = document.createElement('li');
      li.classList.add('game__item-card', 'game__card--hidden');
      // Верхняя карточка
      const spanOne = document.createElement('span');
      spanOne.classList.add('game__card-number', 'card_number--one');
      spanOne.textContent = cardNumber;
      // Нижняя карточка
      const spanTwo = document.createElement('span');
      spanTwo.classList.add('game__card-number', 'card_number--two');
      spanTwo.textContent = cardNumber;
      // Знак вопроса по умолчанию, котоырй убирается при нажатии
      const spanQuestion = document.createElement('span');
      spanQuestion.classList.add('game__card-number', 'game__card-number--question');
      spanQuestion.textContent = '?';
      // Создаем изображение карточки
      const spanImgOne = document.createElement('span');
      spanImgOne.classList.add('game__card-image-one');

      const spanImgTwo = document.createElement('span');
      spanImgTwo.classList.add('game__card-image-two');

      const spanImgThree = document.createElement('span');
      spanImgThree.classList.add('game__card-image-three');

      // const spanImgFour = document.createElement('span');
      // spanImgFour.classList.add('game__card-image-four');

      // добавление элементов
      li.appendChild(spanOne);
      li.appendChild(spanTwo);
      li.appendChild(spanQuestion);
      li.appendChild(spanImgOne);
      li.appendChild(spanImgTwo);
      li.appendChild(spanImgThree);
      // li.appendChild(spanImgFour);

      // клик
      li.addEventListener('click', function(){
        // если карточка содержит класс game__card--appearance или у карточки есть класс
        // с изменение цвета, мы завершаем выполнение
        if (li.classList.contains('game__card--appearance') || li.classList.contains('game__card--look-simular')) {
          return;
        }
      // Если две карточки уже открыты и они не совпадают, скрываем их и показываем знак вопроса снова
        if (cardOne != null && cardTwo != null){
          cardOne.querySelector('.game__card-number--question').style.display = 'block';
          cardTwo.querySelector('.game__card-number--question').style.display = 'block';
          cardOne.classList.remove('game__card--appearance');
          cardTwo.classList.remove('game__card--appearance');
          // нужно очистить
          cardOne = null;
          cardTwo = null;
        }
        // создаём класс с помощью клика будет  появляться карточка(color, bg-color)
        li.classList.add('game__card--appearance');
        // создаём класс с помощью клика будет убираться вопрос
        spanQuestion.style.display = 'none';

        // при клике на карточку, код проверяет, открыта ли уже одна карточка (cardOne).
        // Если нет, то текущая карточка становится первой открытой (cardOne). Если уже есть
        // открытая карточка (cardOne), то текущая карточка становится второй открытой (cardTwo)
        // Этот код отслеживает, открыта ли уже одна карточка (cardOne). Если переменная
        // cardOne имеет значение null, то это означает, что еще нет открытых карточек, и
        // текущая карточка (li) становится первой открытой (cardOne).

        // Если переменная cardOne не равна null, то это означает, что уже есть одна открытая карточка.
        // В этом случае текущая карточка (li) становится второй открытой (cardTwo).
        if(cardOne === null) {
          cardOne = li;
        }else{
          cardTwo = li;
        };
        // если первая открыта и вторая, то оставляем
        if (cardOne != null && cardTwo !=null) {
          let cardOneNumber = cardOne.textContent;
          let cardTwoNumber = cardTwo.textContent;
          if (cardOneNumber === cardTwoNumber) {
            // добавляем стили на те карточки которые одинаковые
            cardOne.classList.add('game__card--look-simular');
            cardTwo.classList.add('game__card--look-simular');
            // карточки совпали, оставляем их открытыми
            cardOne = null;
            cardTwo = null;
          }
        }
        // когда длина массива равна всем выполненным элменам тогда выводим alert
        if (gamePairs.length === document.querySelectorAll('.game__card--look-simular').length) {
          const WAIT_TIME_MS = 200;
          setTimeout(() => {
            alert('Вы победили!');
          }, WAIT_TIME_MS);
          clearInterval(timer); // Останавливаем таймер, если игра завершена
          game.innerHTML = '';
        }
      })
      // добавление элементов в ul
      game.appendChild(li);
    }
    // Показываем все карточки на 3 секунды, затем скрываем их
    // помещен в конце, потому что сначала нужно создать и отобразить карточки,
    // а затем их показывать и скрывать.
    showAllCards();
    setTimeout(hideAllCards, 3000);
  }
})();
