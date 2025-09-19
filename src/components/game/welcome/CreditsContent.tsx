import { Github } from "lucide-react";

const teamMembers = [
  { name: "Sandro", href: "https://www.linkedin.com/in/sandro-mikautadze/" },
  { name: "Alessandro", href: "https://www.linkedin.com/in/alessandro-pranzo/" },
  { name: "Mattia", href: "https://www.linkedin.com/in/mattia-martino-528363225/" },
  { name: "Michael", href: "https://www.linkedin.com/in/michael-sheroubi/" },
  { name: "Emiliano", href: "https://www.linkedin.com/in/michael-sheroubi/" },
  { name: "Felix", href: "https://felixzieger.de/" },
];

export const CreditsContent = () => {
  return (
    <div className="space-y-4 text-gray-600">
      <p>
        Made by M1X. We are{" "}
        {teamMembers.map((member, index) => {
          const isLast = index === teamMembers.length - 1;
          const isPenultimate = index === teamMembers.length - 2;

          return (
            <span key={member.name}>
              <a
                href={member.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {member.name}
              </a>
              {!isLast && (isPenultimate ? ", and " : ", ")}
              {isLast && "."}
            </span>
          );
        })}
      </p>
      <div className="flex items-center justify-center pt-2">
        <a
          href="https://github.com/felixzieger/think-in-sync/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <Github className="w-5 h-5" />
          <span>View source on GitHub</span>
        </a>
      </div>
    </div>
  );
};
