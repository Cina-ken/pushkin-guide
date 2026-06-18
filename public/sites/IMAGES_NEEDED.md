# Reference images to add here

The recognition engine matches the camera/uploaded photo against reference
images stored in THIS folder (`public/sites/`). Add 2 photos per site, named
EXACTLY as listed below (lowercase, .jpg). 2–3 minutes of right-click → Save.

Good sources: Russian Wikipedia, Yandex Images, Google Images. Pick clear,
straight-on daytime shots. More angles = better matching.

| Site | Filenames | Search term (Yandex/Google Images) |
|------|-----------|-------------------------------------|
| Monument to Pushkin | pushkin-monument-1.jpg, pushkin-monument-2.jpg | памятник Пушкину Ростов Пушкинская |
| Pushkin Spheres | pushkin-spheres-1.jpg, pushkin-spheres-2.jpg | пушкинские шары Ростов |
| Four Lions | four-lions-1.jpg, four-lions-2.jpg | скульптура четыре льва Пушкинская Ростов |
| Monument to Chekhov | chekhov-monument-1.jpg, chekhov-monument-2.jpg | памятник Чехову Ростов Пушкинская |
| Monument to Vysotsky | vysotsky-monument-1.jpg, vysotsky-monument-2.jpg | памятник Высоцкому Ростов Дом кино |
| Paramonov Mansion | paramonov-mansion-1.jpg, paramonov-mansion-2.jpg | особняк Парамонова библиотека ЮФУ Ростов |
| Petrov Mansion | petrov-mansion-1.jpg, petrov-mansion-2.jpg | особняк Петрова музей изобразительных искусств Ростов |
| Don State Library | don-library-1.jpg, don-library-2.jpg | Донская публичная библиотека Ростов здание |

## How to verify it worked
After adding images and running `npm run dev`, open the app, go to "Identify",
click "Upload a photo", and upload ONE of the reference images. It should
recognise the correct site with high confidence. Then try a *different* photo
of the same building (one you did NOT add) to show real recognition.

## Tip for a convincing demo
Add 2 images per site, then demo by uploading a 3rd, different photo of one
building. Matching a photo the model has never seen proves it's real
recognition, not a lookup.
