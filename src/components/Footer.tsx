"use client";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-400 gap-4 sm:gap-0">
          <p>
            © {new Date().getFullYear()} Candy Codex Payment Receiver. All rights reserved.
          </p>
          <div className="flex space-x-3 sm:space-x-4">
            <a
              href="https://candy-codex.gitbook.io/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://candy-codex.gitbook.io/terms-of-use/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Terms of Use
            </a>
            <a
              href="https://candy-codex.gitbook.io/term-of-earnings/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Terms of Earnings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
