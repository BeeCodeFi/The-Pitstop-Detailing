"use client";

import { motion } from "framer-motion";
import { Shield, Award, Users, Clock } from "lucide-react";

const team = [
  { name: "Arjun Kumar", role: "Founder & Lead Detailer", exp: "10+ years" },
  { name: "Ravi Patel", role: "Ceramic Coating Specialist", exp: "7 years" },
  { name: "Suresh Nair", role: "PPF Installation Expert", exp: "5 years" },
  { name: "Ankit Verma", role: "Interior Restoration Lead", exp: "6 years" },
];

const milestones = [
  { year: "2018", event: "Founded The Pitstop Detailing with a single bay" },
  { year: "2019", event: "Expanded to 4-bay facility, added ceramic coating" },
  { year: "2021", event: "Launched PPF services & vehicle pickup/delivery" },
  { year: "2023", event: "5000+ vehicles serviced, team of 12 professionals" },
  { year: "2024", event: "Opened online booking & expanded service area" },
];

export default function AboutPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold text-primary tracking-[0.3em] uppercase">
            Our Story
          </span>
          <h1 className="mt-3 font-heading text-5xl sm:text-6xl md:text-7xl text-foreground">
            ABOUT US
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Born from a passion for automotive perfection, The Pitstop Detailing
            has grown from a one-man operation to the city&apos;s most trusted
            detailing studio. We believe every vehicle deserves to look its
            absolute best.
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { icon: Shield, title: "Quality First", desc: "Premium products & trained technicians" },
            { icon: Award, title: "Certified Pros", desc: "IDA & Gtechniq certified detailers" },
            { icon: Users, title: "Customer Focus", desc: "5000+ happy customers & counting" },
            { icon: Clock, title: "On-Time Delivery", desc: "We respect your time, always" },
          ].map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center p-6 rounded-xl border border-border bg-card"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <value.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-1">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="font-heading text-3xl text-foreground text-center mb-10">
            OUR JOURNEY
          </h2>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative pl-12"
                >
                  <div className="absolute left-2 top-1 h-5 w-5 rounded-full border-2 border-primary bg-background" />
                  <span className="text-xs font-bold text-primary">{m.year}</span>
                  <p className="text-sm text-muted-foreground mt-1">{m.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <div>
          <h2 className="font-heading text-3xl text-foreground text-center mb-10">
            THE TEAM
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center p-6 rounded-xl border border-border bg-card group hover:border-primary/30 transition-colors"
              >
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-2xl font-heading text-primary group-hover:bg-primary/10 transition-colors">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-bold text-foreground">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
                <p className="text-xs text-muted-foreground mt-1">{member.exp}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
