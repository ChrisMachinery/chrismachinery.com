import { SocialIcon } from "@/components/layout/SocialIcon";
import { socialHref, type SocialKey } from "@/lib/socialLinks";
import { cmsLinkEdit } from "@/lib/sanity/visual";

export function SocialLink({
  socialKey,
  label,
  url,
  documentId,
  index,
  className = "",
}: {
  socialKey: SocialKey;
  label: string;
  url?: string;
  documentId?: string;
  index: number;
  className?: string;
}) {
  const href = socialHref(socialKey, url);
  const edit = cmsLinkEdit(documentId, "pageContent", `footerSocialLinks[${index}].url`);
  const content = (
    <>
      <SocialIcon name={socialKey} />
      <span>{label}</span>
    </>
  );
  const styles = `inline-flex items-center gap-2.5 text-sm transition-colors ${className}`;

  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={styles}
        {...edit}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <span className={styles} {...edit}>
      {content}
    </span>
  );
}
