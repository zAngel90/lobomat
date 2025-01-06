import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../icons';

const testimonials = [
  {
    name: "Alex Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    rating: 5,
    text: "¡Increíble servicio! Compré varios emotes y la entrega fue instantánea. Definitivamente volveré a comprar aquí.",
    date: "Hace 2 días",
    purchase: "Bundle de Emotes"
  },
  {
    name: "María González",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    rating: 5,
    text: "La mejor tienda para comprar items de Fortnite. Los precios son excelentes y el soporte es muy amable.",
    date: "Hace 1 semana",
    purchase: "Skin Legendaria"
  },
  {
    name: "Carlos Mendoza",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    rating: 5,
    text: "Super rápido y confiable. El proceso de compra es muy sencillo y los items se entregan al instante.",
    date: "Hace 3 días",
    purchase: "Pack de Bailes"
  },
  {
    name: "Laura Torres",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura",
    rating: 5,
    text: "Excelente atención al cliente. Tuve una duda y me respondieron super rápido. ¡100% recomendado!",
    date: "Hace 5 días",
    purchase: "Bundle Premium"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-secondary-light/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Miles de jugadores confían en nosotros para sus compras de Fortnite. 
            Aquí hay algunas de sus experiencias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-secondary-dark p-6 rounded-xl backdrop-blur-lg border border-primary/10 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full bg-primary/10"
                />
                <div>
                  <h3 className="font-semibold text-white">{testimonial.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Icons.Star key={i} className="w-4 h-4 text-primary" />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-white/80 mb-4">{testimonial.text}</p>
              
              <div className="flex items-center justify-between text-sm text-white/40">
                <span>{testimonial.date}</span>
                <span className="text-primary">{testimonial.purchase}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-white/60 mb-6">
            Únete a miles de jugadores satisfechos
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10k+</div>
              <div className="text-sm text-white/60">Clientes Felices</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50k+</div>
              <div className="text-sm text-white/60">Items Vendidos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
              <div className="text-sm text-white/60">Calificación Promedio</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
