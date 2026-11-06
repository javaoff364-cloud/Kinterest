import type { Photo, Collection } from "./types";
const photo = (id:string, imageUrl:string, alt:string, photographer:string, category:string, width=900, height=1200):Photo => ({
  id, provider:"demo", imageUrl, thumbUrl:imageUrl, alt, photographer, photographerUrl:"https://unsplash.com", sourceUrl:"https://unsplash.com", width, height, category
});
export const demoPhotos:Photo[] = [
 photo("p1","https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900&q=85","Golden sunlight over a misty green valley","Annie Spratt","Nature",1200,1500),
 photo("p2","https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=900&q=85","Warm minimal living room with a cozy chair","Daniil Silantev","Interior",900,1200),
 photo("p3","https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=85","Quiet mountain landscape beneath a blue sky","Luca Bravo","Travel",1200,900),
 photo("p4","https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85","Neutral fashion outfit and textures","Hannah Morgan","Fashion",900,1350),
 photo("p5","https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&q=85","Fresh colorful food and healthy ingredients","Anna Pelzer","Food",900,1100),
 photo("p6","https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&q=85","Modern architectural lines and geometry","Joel Filipe","Architecture",900,1300),
 photo("p7","https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=85","Starry night sky above snowy mountains","Simon Berger","Nature",900,1200),
 photo("p8","https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&q=85","Artist desk with paint and creative tools","和 李","Art",900,1150),
 photo("p9","https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=85","Thoughtful boutique interior with warm details","Clark Street Mercantile","Interior",900,1200),
 photo("p10","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=85","Layered mountain peaks in soft morning light","Simon Berger","Travel",900,1200),
 photo("p11","https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=85","Soft spring flowers in natural light","Amy Shamblen","Nature",900,1200),
 photo("p12","https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=85","Beautifully styled dinner table and food","Eaters Collective","Food",900,1050),
 photo("p13","https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85","Minimal fashion inspiration on a city street","Korie Cull","Fashion",900,1250),
 photo("p14","https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=900&q=85","Sculptural modern building facade","Joel Filipe","Architecture",900,1150),
 photo("p15","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85","Editorial portrait with a clean fashion look","Zachary Staines","Fashion",900,1300),
 photo("p16","https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&q=85","Open road through a scenic landscape","Andreas Selter","Travel",900,1200),
 photo("p17","https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&q=85","Calm home corner with plants and decor","Spacejoy","Interior",900,1150),
 photo("p18","https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=900&q=85","Ocean waves rolling toward a quiet shore","Jeremy Bishop","Nature",900,1250)
];
export const categories=["All","Nature","Interior","Travel","Fashion","Food","Architecture","Art"];
export const collections:Collection[]=[
 {id:"c1",title:"Slow mornings",description:"Soft light, quiet spaces and a slower start.",cover:demoPhotos[1].imageUrl,count:24},
 {id:"c2",title:"Places to wander",description:"Landscapes that make you want to go.",cover:demoPhotos[2].imageUrl,count:38},
 {id:"c3",title:"Everyday color",description:"Little details worth noticing.",cover:demoPhotos[10].imageUrl,count:16}
];