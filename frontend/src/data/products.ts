export interface Product {
  id: string;
  name: string;
  price: number;
  category: "Men's" | "Women's" | string;
  image: string;
  description: string;
  sizes?: string[];
}

export const mockProducts: Product[] = [
  {
    id: "s1",
    name: "Void-Runner X1",
    price: 10,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    description: "Ultra-lightweight runners featuring a neon-green outsole for maximum aesthetic. Pairs perfectly with our performance T-shirts.",
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
  },
  {
    id: "s2",
    name: "Aero-Glow Trainers",
    price: 10,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
    description: "High-intensity training shoes with dynamic reactive cushioning. Best worn with our reactive T-shirts.",
    sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"],
  },
  {
    id: "s3",
    name: "Nike Air Max 1 Premium “Escape”",
    price: 18000,
    category: "Shoes",
    image: "/images/products/Nike-Air-Max-1-Premium-Escape-.jpg",
    description: "Premium leather and mesh upper with classic Air Max cushioning. A great match for any T-shirt.",
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
  },
  {
    id: "s4",
    name: "Shoetopia Brown Leather Ankle Boots",
    price: 1200,
    category: "Shoes",
    image: "/images/products/Shoetopia-Brown-Leather-Ankle-Boots-Side-Zip-Block-Heel-.jpg",
    description: "Stylish brown leather ankle boots with side zip and block heel.",
    sizes: ["UK 5", "UK 6", "UK 7", "UK 8"],
  },
  {
    id: "s5",
    name: "Nike Air Max 90 Ultra 2.0 Flyknit “Rough Green & Dark Grey”",
    price: 16500,
    category: "Shoes",
    image: "/images/products/Nike-Air-Max-90-Ultra-2.0-Flyknit-Rough-Green-Dark-Grey-.jpg",
    description: "Lightweight Flyknit upper with the iconic Air Max 90 silhouette.",
    sizes: ["UK 8", "UK 9", "UK 10", "UK 11"],
  },
  {
    id: "s6",
    name: "Nike Air Force 1 Low “Easter Multi Pastel” IB4493‑252",
    price: 12500,
    category: "Shoes",
    image: "/images/products/Nike-Air-Force-1-Low-Easter-Multi-Pastel-IB4493-252-.jpg",
    description: "Vibrant pastel colors on the classic Air Force 1 Low silhouette.",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9"],
  },
  {
    id: "s7",
    name: "Nike Fly.By Mid 3 Basketball Shoes Black/White",
    price: 5500,
    category: "Shoes",
    image: "/images/products/Nike-Fly.By-Mid-3-Basketball-Shoes-BlackWhite-.jpg",
    description: "High-performance basketball shoes with excellent ankle support.",
    sizes: ["UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
  },
  {
    id: "s8",
    name: "Nike Air Max 1 Essential White/Grey/Green",
    price: 11900,
    category: "Shoes",
    image: "/images/products/Nike-Air-Max-1-Essential-WhiteGreyGreen-.jpg",
    description: "Classic Air Max 1 in a clean white, grey, and green colorway.",
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
  },
  {
    id: "s9",
    name: "Converse Chuck Taylor All Star High Top Red Canvas",
    price: 5500,
    category: "Shoes",
    image: "/images/products/Converse-Chuck-Taylor-All-Star-High-Top-Red-Canvas-.jpg",
    description: "The iconic high-top sneaker in classic red canvas.",
    sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
  },
  {
    id: "s10",
    name: "Nike Air Force 1 ’07 Leather “Black/White Panda” Special Edition",
    price: 10200,
    category: "Shoes",
    image: "/images/products/Nike-Air-Force-1-07-Leather-BlackWhite-Panda-Special-Edition.jpg",
    description: "Special edition Panda colorway for the legendary Air Force 1.",
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
  },
  {
    id: "s11",
    name: "Off‑White x Nike Air Force 1 Low “Lemonade” DD1876‑700",
    price: 85000,
    category: "Shoes",
    image: "/images/products/Off-White-x-Nike-Air-Force-1-Low-Lemonade-DD1876-700-.jpg",
    description: "Exclusive collaboration between Off-White and Nike in a bold Lemonade colorway.",
    sizes: ["UK 8", "UK 9", "UK 10"],
  },
  {
    id: "s12",
    name: "New Balance 327 “Deep Olive Green” MS327WG",
    price: 12500,
    category: "Shoes",
    image: "/images/products/New-Balance-327-Deep-Olive-Green-MS327WG-.jpg",
    description: "70s-inspired lifestyle sneaker with a modern twist in Deep Olive Green.",
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
  },
  {
    id: "s13",
    name: "Nike Air Max Plus Black Mesh Customizable",
    price: 14500,
    category: "Shoes",
    image: "/images/products/Nike-Air-Max-Plus-Black-Mesh-Customizable-.jpg",
    description: "Tuned Air experience with a breathable black mesh upper.",
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
  },
  {
    id: "a1",
    name: "Cyber-Mesh Neon Jacket",
    price: 15999,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
    description: "A futuristic lightweight jacket with reflective neon trims and mesh breathability.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "a2",
    name: "Pulse Reactive Joggers",
    price: 3999,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
    description: "High-performance joggers designed for dynamic movement.",
    sizes: ["M", "L", "XL"],
  },
  {
    id: "a4",
    name: "Urban Ink Black T-shirt",
    price: 2499,
    category: "Apparel",
    image: "/images/products/ryan-grice-VKDzcs8kD8E-unsplash.jpg",
    description: "A premium heavyweight cotton T-shirt with a minimalist urban aesthetic. Perfect for street style.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "a5",
    name: "Striker Pro Red Jersey T-shirt",
    price: 3499,
    category: "Apparel",
    image: "/images/products/mohamed-elwaid-88gDjedDgkA-unsplash.jpg",
    description: "High-performance sports jersey T-shirt with bold red and black stripes. Breathable and reactive.",
    sizes: ["M", "L", "XL"],
  },
  {
    id: "a6",
    name: "Obsidian Urban Button-Down T-shirt",
    price: 4999,
    category: "Apparel",
    image: "/images/products/marcel-j-uWrCdB5sM-unsplash.jpg",
    description: "Sleek obsidian black button-down shirt-style T-shirt. Versatile for both casual and semi-formal wear.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "a7",
    name: "Street Graphics T-shirt",
    price: 2199,
    category: "Apparel",
    image: "/images/products/bandar-baant-cxQqh5FQt6g-unsplash.jpg",
    description: "Express your urban identity with this graphic T-shirt featuring underground street art designs.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "a8",
    name: "On Air Always Extra T-shirt",
    price: 2299,
    category: "Apparel",
    image: "/images/products/bandar-baant-eX0SV3fS-QY-unsplash.jpg",
    description: "The 'On Air Always Extra' signature T-shirt. A bold statement piece for the modern hypebeast.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "a9",
    name: "Concrete Basics Gray T-shirt",
    price: 1899,
    category: "Apparel",
    image: "/images/products/taylor-dG4Eb_oC5iM-unsplash.jpg",
    description: "Ultra-soft gray marl T-shirt. An essential base layer for any high-end streetwear outfit.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "a10",
    name: "Arch Logo Purple Crewneck T-shirt",
    price: 3199,
    category: "Apparel",
    image: "/images/products/kevin-gil-musngi-7JmhXPtW5Co-unsplash.jpg",
    description: "Vibrant purple crewneck T-shirt featuring the iconic embroidered Arch brand logo.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "a11",
    name: "Metro Gray Urban T-shirt",
    price: 1999,
    category: "Apparel",
    image: "/images/products/arrul-lin-sYhUhse5uT8-unsplash.jpg",
    description: "A refined gray urban T-shirt with a modern silhouette and premium fabric finish.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "m1",
    name: "Neo-Core Graphic Hoodie",
    price: 4500,
    category: "Men's",
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=800&auto=format&fit=crop",
    description: "Heavyweight tech hoodie featuring luminous cybernetic print detailing and adjustable toggle hood. Engineered for comfort and style.",
    sizes: ["M", "L", "XL"],
  },
  {
    id: "m2",
    name: "Cyberpunk Utility Cargo Pants",
    price: 6200,
    category: "Men's",
    image: "https://images.unsplash.com/photo-1517462964-21fdcec3f25b?q=80&w=800&auto=format&fit=crop",
    description: "Relaxed-fit cargo pants constructed from durable water-resistant nylon. Features modular utility pockets and adjustable ankle straps.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "m3",
    name: "Apex Tech Windbreaker",
    price: 7500,
    category: "Men's",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop",
    description: "Breathable wind-proof technical jacket with reflective panel accents and fully taped seams. Perfect for outdoor training or wet urban commutes.",
    sizes: ["M", "L", "XL"],
  },
  {
    id: "m4",
    name: "Vanguard Compression Tee",
    price: 2800,
    category: "Men's",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop",
    description: "Ultra-stretch compression t-shirt with quick-dry moisture wicking properties. Designed to optimize muscle recovery and blood flow.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "m5",
    name: "Phantom Street Vest",
    price: 5100,
    category: "Men's",
    image: "https://images.unsplash.com/photo-1620012253295-c05cb1e74008?q=80&w=800&auto=format&fit=crop",
    description: "A minimalist tactical-inspired utility vest with adjustable side straps and multiple front zippered pockets. The ultimate layering piece.",
    sizes: ["M", "L", "XL"],
  },
  {
    id: "w1",
    name: "Lumina Sculpt Leggings",
    price: 3800,
    category: "Women's",
    image: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=800&auto=format&fit=crop",
    description: "High-waisted compression leggings in a buttery-soft, squat-proof performance knit fabric. Features a subtle neon line accent.",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "w2",
    name: "Helix Ribbed Sports Bra",
    price: 2400,
    category: "Women's",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    description: "Medium-support sports bra featuring seamless construction and a racerback strap design. Highly breathable and stylish.",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "w3",
    name: "Aero-Light Cropped Hoodie",
    price: 4200,
    category: "Women's",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    description: "Premium cropped fleece hoodie with drop shoulder sleeves and dynamic drawstring toggles. Comfortable for post-workout wear.",
    sizes: ["S", "M", "L"],
  },
  {
    id: "w4",
    name: "Velo Tech Cycling Shorts",
    price: 2200,
    category: "Women's",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
    description: "Chafeless high-rise technical shorts featuring a hidden side phone pocket and reflective rear branding.",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "w5",
    name: "Spectra Oversized Bomber Jacket",
    price: 8900,
    category: "Women's",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=800&auto=format&fit=crop",
    description: "An oversized tech-satin bomber jacket with insulated lining, heavy duty zippers, and contrast neon accents. Premium streetwear.",
    sizes: ["S", "M", "L"],
  },
];

export async function getProducts(): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  
  try {
    const res = await fetch(`${apiUrl}/api/products`, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      console.warn(`⚠️ Backend returned ${res.status}. Falling back to mock data.`);
      return mockProducts;
    }
    
    const data = await res.json();
    
    if (data && data.length > 0) {
      return data.map((item: any) => ({
        id: item._id?.toString() || item.id,
        name: item.name || 'Unnamed Product',
        price: item.price || 0,
        image: item.image || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
        category: item.category === 'Men' || item.category === 'Mens' ? "Men's" : 
                  item.category === 'Women' || item.category === 'Womens' ? "Women's" : 
                  item.category === 'Shoes' ? "Shoes" :
                  item.category === 'Watches' ? "Watches" :
                  item.category === 'Apparel' ? "Apparel" : item.category || "Apparel",
        description: item.description || 'Premium aesthetic clothing.',
        sizes: Array.isArray(item.sizes) ? item.sizes : 
               (typeof item.sizes === 'string' ? (() => {
                 try { return JSON.parse(item.sizes); } catch(e) { return ["S", "M", "L"]; }
               })() : ["S", "M", "L"]),
      }));
    }
    
    return mockProducts;
  } catch (error) {
    console.error('❌ Failed to load products from backend:', error);
    return mockProducts;
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(p => p.id === id);
}
