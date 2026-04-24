import { Icon } from "@iconify/react";

const ProtectedFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left - Copyright */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0096C7] flex items-center justify-center">
              <Icon icon="mdi:pulse" className="text-white text-lg" />
            </div>
            <p className="text-sm text-gray-600">
              © {currentYear} Pulse360. All rights reserved.
            </p>
          </div>

          {/* Right - Support Contact */}
          <div className="flex items-center gap-4">
            
            <a
              href="mailto:support@pulse360.com"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#0096C7] hover:bg-gray-50 rounded-lg transition-all"
            >
              <Icon icon="mdi:email-outline" className="w-4 h-4" />
              <span className="hidden sm:inline">Contact Support</span>
              <span className="sm:hidden">Support</span>
            </a>

            <a
              href="/privacy"
              className="text-sm text-gray-500 hover:text-[#0096C7] transition-colors"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="text-sm text-gray-500 hover:text-[#0096C7] transition-colors"
            >
              Terms
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default ProtectedFooter;