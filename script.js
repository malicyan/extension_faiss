registerExtension({
  name: "FAISS Vector Store",
  id: "extension_faiss",
  description: "Backend vectoriel FAISS pour SillyTavern.",
  onEnable() {
    console.log("🧠 Extension FAISS activée !");
  },
  onDisable() {
    console.log("🧠 Extension FAISS désactivée !");
  }
});