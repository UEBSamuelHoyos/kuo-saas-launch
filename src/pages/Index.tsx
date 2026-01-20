import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ConsultationModal from "@/components/ConsultationModal";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenModal={openModal} />
      <Hero onOpenModal={openModal} />
      <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Index;
