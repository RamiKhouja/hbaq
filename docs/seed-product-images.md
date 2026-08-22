# Seed product images

`ProductSeeder` expects these files in `public/pictures/products/seed/`. The links
below are direct downloads. Fruits and legumes use real Wikimedia Commons
photographs on white or transparent backgrounds; the remaining products use
transparent PNGs from the open-source Google Noto Emoji set. Check each linked
source page for its attribution requirements before publishing.

| Category | Product | Save as | Download |
| --- | --- | --- | --- |
| Fruits | Apple | `apple.jpg` | [Photo](https://commons.wikimedia.org/wiki/Special:Redirect/file/Red_Apple.jpg) · [source/license](https://commons.wikimedia.org/wiki/File:Red_Apple.jpg) |
| Fruits | Banana | `banana.jpg` | [Photo](https://commons.wikimedia.org/wiki/Special:Redirect/file/Banana_isolated_on_white.jpg) · [source/license](https://commons.wikimedia.org/wiki/File:Banana_isolated_on_white.jpg) |
| Fruits | Orange | `orange.jpg` | [Photo](https://commons.wikimedia.org/wiki/Special:Redirect/file/Orange_Fruit_Close-up.jpg) · [source/license](https://commons.wikimedia.org/wiki/File:Orange_Fruit_Close-up.jpg) |
| Fruits | Strawberry | `strawberry.png` | [Photo](https://commons.wikimedia.org/wiki/Special:Redirect/file/Strawberry_%28transparent_background%29.png) · [source/license](https://commons.wikimedia.org/wiki/File:Strawberry_%28transparent_background%29.png) |
| Fruits | Pear | `pear.jpg` | [Photo](https://commons.wikimedia.org/wiki/Special:Redirect/file/PearPhoto.jpg) · [source/license](https://commons.wikimedia.org/wiki/File:PearPhoto.jpg) |
| Vegetables | Tomato | `tomato.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f345.png) |
| Vegetables | Carrot | `carrot.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f955.png) |
| Vegetables | Cucumber | `cucumber.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f952.png) |
| Vegetables | Bell Pepper | `bell-pepper.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1fad1.png) |
| Vegetables | Eggplant | `eggplant.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f346.png) |
| Herbs and greens | Basil | `basil.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f33f.png) |
| Herbs and greens | Parsley | `parsley.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f96c.png) |
| Herbs and greens | Mint | `mint.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f331.png) |
| Herbs and greens | Rosemary | `rosemary.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f332.png) |
| Herbs and greens | Garlic | `garlic.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f9c4.png) |
| Organic products | Organic Olives | `organic-olives.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1fad2.png) |
| Organic products | Organic Honey | `organic-honey.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f36f.png) |
| Organic products | Organic Eggs | `organic-eggs.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f95a.png) |
| Organic products | Organic Dates | `organic-dates.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f334.png) |
| Organic products | Organic Couscous | `organic-couscous.png` | [PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f35a.png) |
| Legumes | Kidney Beans | `kidney-beans.jpg` | [Photo](https://commons.wikimedia.org/wiki/Special:Redirect/file/Sa_kidneybeans.jpg) · [source/license](https://commons.wikimedia.org/wiki/File:Sa_kidneybeans.jpg) |
| Legumes | Chickpeas | `chickpeas.jpg` | [Photo](https://commons.wikimedia.org/wiki/Special:Redirect/file/Chickpea_in_White_colour.jpg) · [source/license](https://commons.wikimedia.org/wiki/File:Chickpea_in_White_colour.jpg) |
| Legumes | Green Lentils | `green-lentils.jpg` | [Photo](https://commons.wikimedia.org/wiki/Special:Redirect/file/Green_Lentils.JPG) · [source/license](https://commons.wikimedia.org/wiki/File:Green_Lentils.JPG) |
| Legumes | Green Peas | `green-peas.jpg` | [Photo](https://commons.wikimedia.org/wiki/Special:Redirect/file/Green_peas.jpg) · [source/license](https://commons.wikimedia.org/wiki/File:Green_peas.jpg) |
| Legumes | Peanuts | `peanuts.jpg` | [Photo](https://commons.wikimedia.org/wiki/Special:Redirect/file/Peanuts_%281%29.jpg) · [source/license](https://commons.wikimedia.org/wiki/File:Peanuts_%281%29.jpg) |

After saving the files, seed the catalogue with:

```bash
php artisan db:seed --class=ProductSeeder
```

Prices are in TND. A product is considered on sale whenever its first price row
has an active `discount_price`; the seeded sale prices have no date boundary and
therefore remain active until edited.
