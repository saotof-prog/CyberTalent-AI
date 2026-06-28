import { SignUp } from "@clerk/nextjs";
import AuthLayout from "@/components/auth-layout";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp
        fallbackRedirectUrl="/choose-role"
        signInUrl="/sign-in"
        appearance={{
          variables: {
            colorPrimary: "#00FF41",
            colorBackground: "#000000",
            colorInputBackground: "#0A0A0A",
            colorInputText: "#E0E0E0",
            colorText: "#CCCCCC",
            colorTextSecondary: "#666666",
            colorDanger: "#FF3333",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            borderRadius: "0.5rem",
          },
          elements: {
            card: "bg-transparent shadow-none p-0",
            headerTitle: "text-[#00FF41] font-bold text-xl",
            headerSubtitle: "text-gray-500 text-xs font-mono",
            socialButtonsBlockButton: "border border-white/10 bg-transparent hover:bg-white/5 text-gray-300 rounded-lg h-10",
            dividerLine: "bg-white/10",
            dividerText: "text-gray-500 font-mono text-xs",
            formFieldLabel: "text-gray-400 font-mono text-xs",
            formFieldInput: "bg-[#0A0A0A] border border-white/10 text-gray-200 rounded-lg",
            footerActionLink: "text-[#00FF41] font-mono text-xs",
            footerActionText: "text-gray-500 font-mono text-xs",
            formButtonPrimary: "bg-[#00FF41] hover:brightness-110 text-black font-bold rounded-lg h-10",
            alert: "rounded-lg bg-red-950/30 border border-red-500/20",
            alertText: "text-red-400 font-mono text-xs",
          },
        }}
      />
    </AuthLayout>
  );
}
