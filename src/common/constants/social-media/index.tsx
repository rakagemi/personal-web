import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
} from "@tabler/icons-react";

export const SOCIAL_LINKS = [
    {   name: "LinkedIn",
        url: "https://www.linkedin.com/in/raka-gemi-612b031a9/" ,
        image: "/assets/social-media/linkedin.svg",
        image_colour: "/assets/social-media/colour-linkedin.svg",
        icon: <IconBrandLinkedin stroke={1.5} className="h-5 w-5" />,
        className: "text-neutral-500 hover:text-blue-500 dark:text-neutral-500 dark:hover:text-blue-400",
    },
    {   name: "GitHub",
        url: "https://github.com/rakagemi",
        image: "/assets/social-media/github.svg",
        image_colour: "/assets/social-media/colour-github.svg",
        icon: <IconBrandGithub stroke={1.5} className="h-5 w-5" />,
        className: "text-neutral-500 hover:text-black dark:text-neutral-500 dark:hover:text-white",
    },
    {   name: "Gmail",
        url: "mailto:raka.pancid@gmail.com",
        image: "/assets/social-media/gmail.svg",
        image_colour: "/assets/social-media/colour-gmail.svg",
        icon: <IconMail stroke={1.5} className="h-5 w-5" />,
        className:"text-neutral-500 hover:text-rose-500 dark:text-neutral-500 dark:hover:text-rose-400",
    },
]