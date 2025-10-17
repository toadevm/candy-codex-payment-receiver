"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-4 ">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="text-3xl sm:text-5xl tracking-wider md:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 font-chewy"
            variants={itemVariants}
          >
            🍭 Candy Codex Mint
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4 font-dynapuff"
            variants={itemVariants}
          >
            Mint the genesis collection of Candy Codex. Each Lollypop NFT is
            uniquely crafted and marks the beginning of our sweet digital
            universe on Ethereum.
          </motion.p>

          {/* <motion.div 
            className="grid md:grid-cols-3 gap-6 mt-12"
            variants={containerVariants}
          >
            <motion.div 
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-4xl mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                🎨
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unique Art</h3>
              <p className="text-gray-600">
                Every Lollypop features distinctive traits and colorful designs
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: -1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-4xl mb-4"
                whileHover={{ scale: 1.2, rotate: -10 }}
              >
                🔒
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Ownership</h3>
              <p className="text-gray-600">
                Permanently stored on Ethereum blockchain with full ownership rights
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-4xl mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                💎
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Limited Supply</h3>
              <p className="text-gray-600">
                Only 550 Lollypops will ever exist, making each one truly special
              </p>
            </motion.div>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
}
