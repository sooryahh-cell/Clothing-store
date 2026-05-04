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
    id: "m1",
    name: "Cyber-Mesh Neon Jacket",
    price: 15999,
    category: "Men's",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
    description: "A futuristic lightweight jacket with reflective neon trims and mesh breathability.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "m2",
    name: "Pulse Reactive Joggers",
    price: 3999,
    category: "Men's",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
    description: "High-performance joggers designed for dynamic movement.",
    sizes: ["M", "L", "XL"],
  },
  {
    id: "m3",
    name: "Void-Runner Sneakers",
    price: 8999,
    category: "Men's",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    description: "Ultra-lightweight runners featuring a neon-green outsole for maximum aesthetic.",
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
  },
  {
    id: "m4",
    name: "Baggy Street Jeans",
    price: 2499,
    category: "Men's",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop",
    description: "Wide-fit baggy jeans with subtle distressed detailing for the urban streetwear look.",
    sizes: ["28", "30", "32", "34", "36"],
  },
  {
    id: "m5",
    name: "Oversized Drop Tee",
    price: 1199,
    category: "Men's",
    image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1000&auto=format&fit=crop",
    description: "Heavyweight drop-shoulder tee with a boxy silhouette. Pure streetwear energy.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "w1",
    name: "Lumina Compression Set",
    price: 5499,
    category: "Women's",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    description: "A sleek, dark compression top and leggings set featuring subtle neon magenta lines.",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "w2",
    name: "Neon-Grid Windbreaker",
    price: 4299,
    category: "Women's",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop",
    description: "Cropped windbreaker with an iridescent, glowing grid pattern.",
    sizes: ["S", "M", "L"],
  },
  {
    id: "w3",
    name: "Aero-Glow Training Shoes",
    price: 7999,
    category: "Women's",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
    description: "High-intensity training shoes with dynamic reactive cushioning.",
    sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"],
  },
  {
    id: "w4",
    name: "Wide Leg Flow Jeans",
    price: 2799,
    category: "Women's",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop",
    description: "High-waisted wide leg jeans in premium stretch denim for all-day comfort.",
    sizes: ["26", "28", "30", "32"],
  },
  {
    id: "w5",
    name: "Cropped Logo Tee",
    price: 899,
    category: "Women's",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop",
    description: "Cropped relaxed-fit tee with Terra Fit emblem. Simple, clean, iconic.",
    sizes: ["XS", "S", "M", "L"],
  },
];

export async function getProducts(): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  
  try {
    const res = await fetch(`${apiUrl}/api/products`, { 
      next: { revalidate: 60 } 
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
                  item.category === 'Women' || item.category === 'Womens' ? "Women's" : "Men's",
        description: item.description || 'Premium aesthetic clothing.',
        sizes: item.sizes || ["S", "M", "L"],
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
