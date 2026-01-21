"use client";

import { use, useState } from "react";
import { ArrowLeft, Check, Calendar as CalendarIcon, Clock, ChevronRight, CreditCard, Scissors } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [step, setStep] = useState(1);
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const services = [
        { id: 1, name: "Corte Clásico", price: 25, duration: "45 min" },
        { id: 2, name: "Afeitado Royal", price: 20, duration: "30 min" },
        { id: 3, name: "Diseño Barba", price: 15, duration: "20 min" },
    ];

    const timeSlots = ["10:00", "10:45", "11:30", "13:00", "15:00", "16:45", "18:00"];

    const toggleService = (id: number) => {
        if (selectedServices.includes(id)) {
            setSelectedServices(selectedServices.filter(s => s !== id));
        } else {
            setSelectedServices([...selectedServices, id]);
        }
    };

    const totalPrice = services
        .filter(s => selectedServices.includes(s.id))
        .reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className="min-h-screen bg-background pb-24 flex flex-col">
            {/* Header */}
            <div className="px-6 pt-14 pb-4 flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur-md z-30">
                <button onClick={() => step > 1 ? setStep(step - 1) : null} className="w-10 h-10 rounded-full bg-card border border-white/10 flex items-center justify-center text-foreground hover:bg-secondary transition-colors">
                    {step === 1 ? <Link href={`/client/barber/${id}`}><ArrowLeft size={20} /></Link> : <ArrowLeft size={20} />}
                </button>
                <div className="flex-1 text-center">
                    <h1 className="text-lg font-bold font-heading">
                        {step === 1 && "Elige Servicios"}
                        {step === 2 && "Fecha y Hora"}
                        {step === 3 && "Confirmar"}
                    </h1>
                    <p className="text-xs text-muted-foreground">Paso {step} de 3</p>
                </div>
                <div className="w-10" />
            </div>

            {/* Progress Bar */}
            <div className="px-6 mb-6">
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "33%" }}
                        animate={{ width: `${step * 33.33}%` }}
                    />
                </div>
            </div>

            <div className="flex-1 px-6 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-4"
                        >
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => toggleService(service.id)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${selectedServices.includes(service.id)
                                            ? "bg-card border-primary ring-1 ring-primary"
                                            : "bg-card border-border hover:border-primary/50"
                                        }`}
                                >
                                    <div>
                                        <h3 className="font-bold text-foreground">{service.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={10} /> {service.duration}</span>
                                            <span className="text-sm font-bold text-primary">{service.price}€</span>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedServices.includes(service.id) ? "bg-primary border-primary" : "border-muted-foreground"
                                        }`}>
                                        {selectedServices.includes(service.id) && <Check size={14} className="text-black" />}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            {/* Fake Calendar */}
                            <div className="bg-card rounded-3xl p-4 border border-border">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold">Enero 2026</span>
                                    <div className="flex gap-2">
                                        <button className="p-1 hover:bg-secondary rounded"><ChevronRight className="rotate-180" size={16} /></button>
                                        <button className="p-1 hover:bg-secondary rounded"><ChevronRight size={16} /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2 text-muted-foreground">
                                    <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
                                </div>
                                <div className="grid grid-cols-7 gap-2">
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                        <button
                                            key={day}
                                            onClick={() => setSelectedDate(`2026-01-${day}`)}
                                            className={`aspect-square rounded-full text-sm font-medium flex items-center justify-center transition-colors ${selectedDate === `2026-01-${day}` ? "bg-primary text-black font-bold" : "hover:bg-secondary text-foreground"
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div>
                                <h3 className="font-bold mb-3 flex items-center gap-2"><Clock size={16} /> Horarios Disponibles</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {timeSlots.map(time => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-3 rounded-xl text-sm font-bold border transition-colors ${selectedTime === time
                                                    ? "bg-foreground text-background border-transparent"
                                                    : "bg-card border-border hover:border-foreground/50 text-foreground"
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-gradient-to-br from-card to-secondary p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                                <div className="relative z-10 space-y-4">
                                    <div className="flex justify-between items-start border-b border-white/10 pb-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase">Servicio</p>
                                            <h3 className="font-bold text-xl">{selectedServices.length > 1 ? "Pack Personalizado" : services.find(s => s.id === selectedServices[0])?.name}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {services.filter(s => selectedServices.includes(s.id)).map(s => s.name).join(" + ")}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground uppercase">Total</p>
                                            <p className="font-bold text-2xl text-primary">{totalPrice}€</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase">Fecha</p>
                                            <p className="font-bold">{selectedDate || "---"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground uppercase">Hora</p>
                                            <p className="font-bold">{selectedTime || "---"}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Metallic effect */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-bold">Método de Pago</h3>
                                <div className="p-4 bg-card rounded-2xl border border-primary/50 flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={20} className="text-primary" />
                                        <span className="font-medium">Tarjeta de Crédito</span>
                                    </div>
                                    <div className="w-4 h-4 rounded-full border border-primary bg-primary flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-black" />
                                    </div>
                                </div>
                                <div className="p-4 bg-card rounded-2xl border border-border flex items-center justify-between opacity-50 cursor-not-allowed">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium">Apple Pay</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Booking Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-background z-40 border-t border-border/50">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground text-sm">Total Estimado</span>
                    <span className="font-bold text-xl">{totalPrice}€</span>
                </div>
                <button
                    onClick={() => {
                        if (step < 3) setStep(step + 1);
                        // else submitBooking()
                    }}
                    disabled={selectedServices.length === 0}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${selectedServices.length === 0
                            ? "bg-secondary text-muted-foreground cursor-not-allowed"
                            : "bg-primary text-black shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-[1.02]"
                        }`}
                >
                    {step === 3 ? "Confirmar y Pagar" : "Continuar"}
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
