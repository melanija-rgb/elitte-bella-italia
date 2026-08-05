export const RESTAURANT = {
  name: "Elitte Bella Italia",
  tagline: "Autentična italijanska kafa i pizza u srcu Kotor Varoša",
  phone: "+387 51 924-000",
  phoneHref: "tel:+38751924000",
  address: "Cara Dušana 62, Kotor Varoš 78220",
  country: "Bosna i Hercegovina",
  instagram: "https://www.instagram.com/elitte_bella_italia/",
  hours: "Svaki dan 07:00 – 00:00",
  mapEmbed:
    "https://maps.google.com/maps?q=Cara%20Du%C5%A1ana%2062%2C%20Kotor%20Varo%C5%A1%2078220&t=&z=16&ie=UTF8&iwloc=&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=Cara+Du%C5%A1ana+62,+Kotor+Varo%C5%A1+78220",
} as const;

export const GALLERY = [
  { src: "/galerija/eksterijer-noc.png", alt: "Elitte Bella Italia noću" },
  { src: "/galerija/martini.png", alt: "Martini kokteli" },
  { src: "/galerija/kafa.png", alt: "Kafa Elitte Bella Italia" },
  { src: "/galerija/terasa.png", alt: "Terasa restorana" },
  { src: "/galerija/pizza-closeup.jpg", alt: "Pizza u Elitte Bella Italia" },
  { src: "/galerija/pizza-mjesovita.jpg", alt: "Mješovita pizza" },
  { src: "/galerija/pizza-prosciutto.jpg", alt: "Pizza sa pršutom" },
  { src: "/galerija/desert.jpg", alt: "Desert" },
] as const;
