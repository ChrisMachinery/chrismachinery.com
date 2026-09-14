import { TrashIcon } from "@sanity/icons/Trash";
import { useClient, type DocumentActionComponent } from "sanity";

export const DeleteInquiryAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2024-08-21" });
  if (props.type !== "inquiry") return null;

  return {
    label: "删除询盘",
    icon: TrashIcon,
    tone: "critical",
    onHandle: async () => {
      const published = props.id.replace(/^drafts\./, "");
      const ids = await client.fetch<string[]>(`*[_id in $ids]._id`, {
        ids: [published, `drafts.${published}`],
      });
      const tx = client.transaction();
      for (const id of ids.length ? ids : [published]) tx.delete(id);
      await tx.commit();
      props.onComplete();
    },
  };
};

DeleteInquiryAction.action = "delete";
