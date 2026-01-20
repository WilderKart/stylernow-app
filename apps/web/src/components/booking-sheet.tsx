"use client";

import { useState } from "react";
import { Barberia, Servicio, Staff, Reserva } from "@/types/db";
import { motion } from "framer-motion";
import { X, Calendar, User as UserIcon, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { createReserva } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

interface BookingSheetProps {
    service: Servicio;
    barberia: Barberia;
    staffList: Staff[];
    onClose: () => void;
}

type Step = 'STAFF' | 'TIME' | 'CONFIRM' | 'SUCCESS' | 'ERROR';

export default function BookingSheet({ service, barberia, staffList, onClose }: BookingSheetProps) {
    const { user } = useAuth();
    const [step, setStep] = useState<Step>('STAFF');
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [bookingResult, setBookingResult] = useState<{ booking: Reserva, paymentRef: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock Available Slots
    const availableSlots = ["09:00", "10:00", "11:30", "14:00", "16:45"];

    const handleCreateReservation = async () => {
        if (!user || !selectedStaff || !selectedTime) return;

        setIsSubmitting(true);
        try {
            // STRICT: Frontend requests creation, Backend sets status 'pending'
            // Using "Today" + Selected Time for simplicity as per original design
            const startIso = new Date().toISOString().split('T')[0] + `T${selectedTime}:00Z`;

            // Call Real API (Edge Function calculates end_time based on service duration)
            const response = await createReserva({
                staff_id: selectedStaff.id,
                service_id: service.id,
                start_time: startIso
            });

            setBookingResult({
                booking: response.data,
                paymentRef: response.payment_info.reference
            });
            setStep('SUCCESS');

        } catch (error) {
            console.error("Booking Error:", error);
            setStep('ERROR');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 overflow-hidden shadow-floating max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reservar</p>
                        <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto pb-32">

                    {/* STEP 1: STAFF SELECTION */}
                    {step === 'STAFF' && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold">Selecciona profesional</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {staffList.map(s => (
                                    <div
                                        key={s.id}
                                        onClick={() => setSelectedStaff(s)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedStaff?.id === s.id ? 'border-brand bg-brand/5' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 relative overflow-hidden">
                                                <Image src={s.photo_url || "/placeholder.jpg"} alt={s.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 leading-tight">{s.name}</p>
                                                <p className="text-xs text-brand font-medium">{s.nivel}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: TIME SELECTION */}
                    {step === 'TIME' && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold">Horarios disponibles</h4>
                            <div className="grid grid-cols-3 gap-3">
                                {availableSlots.map(time => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${selectedTime === time ? 'border-brand bg-brand/5 text-brand-dark' : 'border-gray-100 text-gray-600'}`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: SUCCESS (PENDING) */}
                    {step === 'SUCCESS' && bookingResult && (
                        <div className="text-center py-8 space-y-4">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-4">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">¡Reserva Pendiente!</h3>
                            <p className="text-gray-500">Un paso más para confirmar tu estilo.</p>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-left space-y-2 mt-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Estado:</span>
                                    <span className="text-yellow-600 font-bold text-sm uppercase bg-yellow-100 px-2 py-0.5 rounded">Pending Confirmation</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Ref Wompi:</span>
                                    <span className="text-gray-900 font-mono text-sm">{bookingResult.paymentRef}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200 mt-2">
                                    <p className="text-xs text-gray-400">Stylernow no realiza cobros directos. Realiza el pago en Wompi para confirmar.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {step !== 'SUCCESS' && ( // Hide default footer on success
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 safe-area-bottom">
                        {step === 'STAFF' && (
                            <button
                                disabled={!selectedStaff}
                                onClick={() => setStep('TIME')}
                                className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl disabled:opacity-50 disabled:scale-100 active:scale-95 transition-all text-lg"
                            >
                                Continuar
                            </button>
                        )}

                        {step === 'TIME' && (
                            <div className="flex gap-4">
                                <button onClick={() => setStep('STAFF')} className="px-6 py-4 bg-gray-100 text-gray-900 font-bold rounded-2xl">
                                    Atrás
                                </button>
                                <button
                                    disabled={!selectedTime || isSubmitting}
                                    onClick={handleCreateReservation}
                                    className="flex-1 py-4 bg-brand text-white font-bold rounded-2xl disabled:opacity-50 active:scale-95 transition-all text-lg shadow-lg shadow-brand/20"
                                >
                                    {isSubmitting ? "Procesando..." : "Confirmar Reserva"}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Success Footer */}
                {step === 'SUCCESS' && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 safe-area-bottom">
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl active:scale-95 transition-all"
                        >
                            Entendido
                        </button>
                    </div>
                )}

            </motion.div>
        </>
    );
}
