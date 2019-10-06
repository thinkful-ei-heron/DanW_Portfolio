'use strict';

function init() {
  //let gradient = document.querySelector('.gradientBackground');
  let timeline = document.querySelector('.timelineCover');
  let screenWidth = window.innerWidth;
  let threshold;

  if (screenWidth < 800) threshold = 0.5;
  else threshold = 0.8;

  let options = {
    root: document.querySelector('#scrollArea'),
    rootMargin: '0px',
    threshold: threshold
  };

  let callback = (entries, observer) => {
    //console.dir(entries);
    //console.dir(options);
    entries.forEach(entry => {
      //console.dir(threshold);

      if (entry.target === targetSkills1 && entry.isIntersecting) {
        if (!timeline.classList.contains('show1')) {
          timeline.classList.toggle('show1');
          setTimeout(() => {
            document.querySelector('.exp1, cover').classList.toggle('uncover');
          }, 700);
        }
      }

      if (entry.target === targetSkills2 && entry.isIntersecting) {
        if (!timeline.classList.contains('show2')) {
          timeline.classList.toggle('show2');
          setTimeout(() => {
            document.querySelector('.exp2, cover').classList.toggle('uncover');
          }, 700);
        }
      }

      if (entry.target === targetSkills3 && entry.isIntersecting) {
        if (!timeline.classList.contains('show3')) {
          timeline.classList.toggle('show3');
          setTimeout(() => {
            document.querySelector('.exp3, cover').classList.toggle('uncover');
          }, 700);
        }
      }

      if (entry.target === targetSkills4 && entry.isIntersecting) {
        if (!timeline.classList.contains('show4')) {
          timeline.classList.toggle('show4');
          setTimeout(() => {
            document.querySelector('.exp4, cover').classList.toggle('uncover');
          }, 700);
        }
      }
    });
  };

  let observer = new IntersectionObserver(callback, options);
  let targetSkills1 = document.querySelector('#marker1');
  let targetSkills2 = document.querySelector('#marker2');
  let targetSkills3 = document.querySelector('#marker3');
  let targetSkills4 = document.querySelector('#marker4');
  //IntersectionObserver.threshold(0);
  observer.observe(targetSkills1);
  observer.observe(targetSkills2);
  observer.observe(targetSkills3);
  observer.observe(targetSkills4);
}

init();
