import { Document, Page, View, Text, Image, StyleSheet, Link } from "@react-pdf/renderer";
import { format } from "date-fns";
import { CATEGORY_MAP } from "@/lib/categories";
import type { Evidence } from "@/lib/types";

const styles = StyleSheet.create({
  page: {
    padding: 42,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#3f2e2e",
  },
  coverTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  coverSubtitle: {
    fontSize: 11,
    color: "#8a7268",
    marginBottom: 24,
  },
  coverRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ecdcd0",
    paddingVertical: 8,
  },
  coverIndex: {
    width: 24,
    color: "#8a7268",
  },
  coverItemTitle: {
    flex: 1,
    fontFamily: "Helvetica-Bold",
  },
  coverMeta: {
    width: 150,
    textAlign: "right",
    color: "#8a7268",
    fontSize: 9,
  },
  badge: {
    fontSize: 8,
    color: "#ffffff",
    backgroundColor: "#8a7268",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  metaLine: {
    fontSize: 9,
    color: "#8a7268",
    marginTop: 8,
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    marginTop: 6,
    marginBottom: 8,
  },
  description: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 12,
  },
  image: {
    marginTop: 6,
    maxHeight: 480,
    objectFit: "contain",
  },
  fileLink: {
    fontSize: 10,
    color: "#5b3a86",
    marginTop: 8,
  },
  imageMissing: {
    marginTop: 6,
    padding: 10,
    fontSize: 9,
    color: "#8a7268",
    backgroundColor: "#f2efe9",
    borderRadius: 4,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 42,
    right: 42,
    fontSize: 8,
    color: "#b3a49a",
    textAlign: "center",
  },
});

function ItemPage({
  item,
  fileUrl,
  imageBuffer,
}: {
  item: Evidence;
  fileUrl?: string | null;
  imageBuffer?: Buffer | null;
}) {
  const cat = CATEGORY_MAP[item.category];
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.badge}>{cat.label.toUpperCase()}</Text>
      <Text style={styles.metaLine}>
        {format(new Date(item.event_date), "d MMMM yyyy")}
        {"  ·  "}Record ID {item.id.slice(0, 8)}
      </Text>
      <Text style={styles.itemTitle}>{item.title}</Text>
      {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
      {item.kind === "photo" && imageBuffer ? (
        <Image src={{ data: imageBuffer, format: "jpg" }} style={styles.image} />
      ) : null}
      {item.kind === "photo" && !imageBuffer && item.file_path ? (
        <Text style={styles.imageMissing}>
          This photo couldn&apos;t be included in the PDF (its file format isn&apos;t supported)
          — view it in the app instead.
        </Text>
      ) : null}
      {item.kind === "document" && fileUrl ? (
        <Link src={fileUrl} style={styles.fileLink}>
          Open original document: {item.file_name ?? "file"}
        </Link>
      ) : null}
      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        fixed
      />
    </Page>
  );
}

export function EvidenceDocument({
  items,
  title,
  subtitle,
}: {
  items: { item: Evidence; fileUrl?: string | null; imageBuffer?: Buffer | null }[];
  title: string;
  subtitle?: string;
}) {
  const showCover = items.length > 1;
  return (
    <Document title={title}>
      {showCover && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.coverTitle}>{title}</Text>
          <Text style={styles.coverSubtitle}>
            {subtitle ?? `${items.length} items · generated ${format(new Date(), "d MMMM yyyy")}`}
          </Text>
          {items.map(({ item }, i) => (
            <View key={item.id} style={styles.coverRow}>
              <Text style={styles.coverIndex}>{i + 1}.</Text>
              <Text style={styles.coverItemTitle}>{item.title}</Text>
              <Text style={styles.coverMeta}>
                {CATEGORY_MAP[item.category].label} · {format(new Date(item.event_date), "d MMM yyyy")}
              </Text>
            </View>
          ))}
        </Page>
      )}
      {items.map(({ item, fileUrl, imageBuffer }) => (
        <ItemPage key={item.id} item={item} fileUrl={fileUrl} imageBuffer={imageBuffer} />
      ))}
    </Document>
  );
}
