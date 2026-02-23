import { Truck, Shield, Clock, Award } from "lucide-react";

const features = [
    {
        icon: Truck,
        title: "Fast Delivery",
        description: "Get your orders delivered within 24 hours",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        icon: Shield,
        title: "Quality Guaranteed",
        description: "100% authentic products from verified sources",
        gradient: "from-green-500 to-emerald-500"
    },
    {
        icon: Clock,
        title: "24/7 Support",
        description: "Our team is always here to help you",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        icon: Award,
        title: "Best Prices",
        description: "Competitive pricing on all premium products",
        gradient: "from-amber-500 to-orange-500"
    }
];

const WhyChooseUs = () => {
    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-slide-up">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">Why Choose Us</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Experience the difference with our premium service
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="text-center animate-scale-in hover-lift"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}>
                                    <Icon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
