import MainLayout from "@/layouts/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Newsletter from "@/components/home/Newsletter";

const HomePage = () => {
    return (
        <MainLayout>
            <div className="animate-fade-in">
                <HeroSection />
                <FeaturedProducts />
                <CategoryShowcase />
                <WhyChooseUs />
                <Newsletter />
            </div>
        </MainLayout>
    );
};

export default HomePage;
