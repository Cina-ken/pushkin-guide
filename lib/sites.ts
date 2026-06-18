/**
 * Dataset of tourist sites on Pushkinskaya Street, Rostov-on-Don (requirement 1).
 *
 * All sites are civilian cultural-heritage objects (monuments, sculptures,
 * historic mansions, a library). No military buildings are included, per the
 * task's explicit prohibition on collecting information about or photographing
 * military objects.
 *
 * Each site lists the reference image filenames the recognition engine will
 * load from /public/sites/. Drop 2-3 photos per site into that folder using
 * the filenames below. The engine computes an embedding for each reference
 * image at startup and matches the camera frame against them.
 *
 * Sources: Russian Wikipedia, ruwiki, znanierussia, travel.ru and local
 * Rostov heritage guides (see the report's reference list).
 */

export type Site = {
  id: string;
  name: string;        // English name
  nameRu: string;      // Russian name (for the report / bilingual UI)
  address: string;
  year: string;
  category: "monument" | "sculpture" | "mansion" | "library";
  summary: string;     // the text shown when the site is recognised
  images: string[];    // reference image files in /public/sites/
};

export const SITES: Site[] = [
  {
    id: "pushkin-monument",
    name: "Monument to A. S. Pushkin",
    nameRu: "Памятник А. С. Пушкину",
    address: "Pushkinskaya St., near Voroshilovsky Ave.",
    year: "1959",
    category: "monument",
    summary:
      "Installed in 1959 near the intersection with Voroshilovsky Avenue, this is the first literary monument in Rostov-on-Don. It was created by sculptor G. A. Shults and architect M. A. Minkus. The street itself was renamed in Pushkin's honour in 1885.",
    images: ["pushkin-monument-1.jpg", "pushkin-monument-2.jpg"],
  },
  {
    id: "pushkin-spheres",
    name: "\"Pushkin Heroes\" Spheres",
    nameRu: "Памятник «Пушкинские герои» (шары)",
    address: "Pushkinsky Boulevard",
    year: "2000s",
    category: "sculpture",
    summary:
      "A set of decorative spheres dedicated to characters from Pushkin's works, created by sculptor A. A. Sknarin. Known locally as the 'Pushkin spheres', they are one of the boulevard's most recognisable artistic landmarks and a popular photo spot.",
    images: ["pushkin-spheres-1.jpg", "pushkin-spheres-2.jpg"],
  },
  {
    id: "four-lions",
    name: "\"Four Lions\" Sculpture",
    nameRu: "Скульптура «Четыре льва»",
    address: "Pushkinskaya St. at Semashko Lane",
    year: "2000s",
    category: "sculpture",
    summary:
      "A sculptural composition of four lions with motifs from the works of A. S. Pushkin, located at the intersection with Semashko Lane. It is part of the chain of Pushkin-themed art that gives the boulevard its literary character.",
    images: ["four-lions-1.jpg", "four-lions-2.jpg"],
  },
  {
    id: "chekhov-monument",
    name: "Monument to A. P. Chekhov",
    nameRu: "Памятник А. П. Чехову",
    address: "Pushkinskaya St. at Chekhov Ave.",
    year: "2010",
    category: "monument",
    summary:
      "Erected in 2010 at the intersection with Chekhov Avenue to mark the 150th anniversary of the writer's birth. Chekhov was born in nearby Taganrog, about an hour and a half from Rostov-on-Don.",
    images: ["chekhov-monument-1.jpg", "chekhov-monument-2.jpg"],
  },
  {
    id: "vysotsky-monument",
    name: "Monument to V. S. Vysotsky",
    nameRu: "Памятник В. С. Высоцкому",
    address: "Pushkinskaya St., in front of the House of Cinema",
    year: "2014",
    category: "monument",
    summary:
      "Unveiled on 25 July 2014, on the 34th anniversary of the poet and singer's death, in front of the House of Cinema (Dom Kino). It honours one of the most beloved figures of 20th-century Russian song and theatre.",
    images: ["vysotsky-monument-1.jpg", "vysotsky-monument-2.jpg"],
  },
  {
    id: "paramonov-mansion",
    name: "Paramonov Mansion (SFU Library)",
    nameRu: "Особняк Парамонова (библиотека ЮФУ)",
    address: "Pushkinskaya St., 148",
    year: "early 20th c.",
    category: "mansion",
    summary:
      "A neoclassical mansion built for the merchant and philanthropist Nikolai Paramonov, designed by architect Leonid Eberg. A federal architectural monument, it now houses the Zonal Scientific Library of Southern Federal University. Its colonnade is a favourite photo location.",
    images: ["paramonov-mansion-1.jpg", "paramonov-mansion-2.jpg"],
  },
  {
    id: "petrov-mansion",
    name: "Petrov Mansion (Museum of Fine Arts)",
    nameRu: "Особняк Петрова (музей изобразительных искусств)",
    address: "Pushkinskaya St., 115",
    year: "early 20th c.",
    category: "mansion",
    summary:
      "An early-20th-century mansion that is a federal architectural monument, recognised for its colonnade. Today it houses a building of the Rostov Regional Museum of Fine Arts.",
    images: ["petrov-mansion-1.jpg", "petrov-mansion-2.jpg"],
  },
  {
    id: "don-library",
    name: "Don State Public Library",
    nameRu: "Донская государственная публичная библиотека",
    address: "Pushkinskaya St., 175a",
    year: "1994",
    category: "library",
    summary:
      "Opened in 1994, this monumental, fortress-like building is one of the oldest book collections in southern Russia. Its deliberately austere exterior was intended to suggest that a book should be judged by its contents, not its cover. A concrete 'open book' flowerbed stands in front.",
    images: ["don-library-1.jpg", "don-library-2.jpg"],
  },
];
