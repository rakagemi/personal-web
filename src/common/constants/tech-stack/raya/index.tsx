import { TechItem } from "@/components/infinite-card";
import { IconBrandCSharp, IconBrandCss3, IconBrandDocker, IconBrandFramerMotion, IconBrandGithub, IconBrandGitlab, IconBrandGolang, IconBrandHtml5, IconBrandJavascript, IconBrandNextjs, IconBrandNpm, IconBrandReact, IconBrandTypescript } from "@tabler/icons-react";
import { BiLogoPostgresql } from "react-icons/bi";
import { SiSonarqubeserver, SiMobx, SiTailwindcss, SiDotnet } from "react-icons/si";

export const RayaTechStack: TechItem[] = [
    { id: "html", name: "HTML5", icon: <IconBrandHtml5 className="text-red-500" /> },
    { id: "css", name: "CSS3", icon: <IconBrandCss3 className="text-blue-500" /> },
    { id: "js", name: "JavaScript", icon: <IconBrandJavascript className="text-yellow-400" /> },
    { id: "ts", name: "TypeScript", icon: <IconBrandTypescript className="text-blue-500" /> },
    { id: "react", name: "React.js", icon: <IconBrandReact className="text-cyan-400" /> },
    { id: "next", name: "Next.js", icon: <IconBrandNextjs className="text-white" /> },
    { id: "npm", name: "NPM", icon: <IconBrandNpm className="text-[#CC3534]" /> },
    { id: "mobx", name: "MobX", icon: <SiMobx className="text-[#ED5D25]" /> },
    { id: "tailwind", name: "Tailwind", icon: <SiTailwindcss className="text-[#00bcd4]" /> },
    { id: "framer-motion", name: "Framer Motion", icon: <IconBrandFramerMotion className="text-yellow-400" /> },
    { id: "golang", name: "Golang", icon: <IconBrandGolang className="text-[#00ADD8]" /> },
    { id: "C#", name: "C#", icon: <IconBrandCSharp className="text-purple-900" /> },
    { id: ".net", name: ".Net", icon: <SiDotnet className="text-purple-700" /> },
    { id: "postgresql", name: "PostgreSQL", icon: <BiLogoPostgresql className="text-[#336791]" /> },
    { id: "docker", name: "Docker", icon: <IconBrandDocker className="text-blue-600" /> },
    { id: "github", name: "GitHub", icon: <IconBrandGithub className="text-gray-300" /> },
    { id: "gitlab", name: "GitLab", icon: <IconBrandGitlab className="text-orange-500" /> },
    { id: "sonarqube", name: "SonarQube", icon: <SiSonarqubeserver className="text-[#126ED3]" /> },

];