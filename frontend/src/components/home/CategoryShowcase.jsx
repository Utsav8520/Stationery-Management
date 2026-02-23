import { Pen, Notebook, Dumbbell, Trophy, BookOpen, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
    {
        name: "Stationery",
        icon: Pen,
        gradient: "from-blue-500 to-cyan-500",
        description: "Premium pens, pencils & writing supplies"
    },
    {
        name: "Sports",
        icon: Dumbbell,
        gradient: "from-orange-500 to-red-500",
        description: "Fitness & exercise equipment",
        image: "https://images.unsplash.com/photo-1519861531473-92002639313c?w=400&h=300&fit=crop"
    },
    {
        name: "Office Supplies",
        icon: Notebook,
        gradient: "from-purple-500 to-pink-500",
        description: "Everything for your workspace"
    },
    {
        name: "School Supplies",
        icon: BookOpen,
        gradient: "from-green-500 to-emerald-500",
        description: "Essential supplies for students"
    },
    {
        name: "Trophies",
        icon: Trophy,
        gradient: "from-yellow-500 to-amber-600",
        description: "Awards & recognition items"
    },
    {
        name: "Art Supplies",
        icon: Pencil,
        gradient: "from-violet-500 to-purple-500",
        description: "Creative art materials"
    }
];

const CategoryShowcase = () => {
    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-slide-up">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">Shop by Category</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explore our diverse collection of Stationery and Sports items
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.name}
                                to={`/products?category=${category.name}`}
                                className="group animate-scale-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div 
                                    className={`relative overflow-hidden rounded-2xl ${category.gradient.includes('from-') ? 'bg-gradient-to-br ' + category.gradient : ''} p-8 h-48 hover-lift cursor-pointer`}
                                    style={category.image ? { backgroundImage: `url(${category.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                                >
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                                    <div className="relative z-10 flex flex-col justify-between h-full text-white">
                                        <Icon className="w-12 h-12 mb-4" />
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                            <p className="text-white/90 text-sm">{category.description}</p>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 translate-y-8 group-hover:scale-150 transition-transform"></div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CategoryShowcase;
