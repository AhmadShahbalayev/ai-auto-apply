// Preserve the person's chosen spelling while keeping folder names portable.
export function isProfileName(name) {
  return (
    typeof name === "string" &&
    name.length > 0 &&
    name === name.trim() &&
    !/[. ]$/.test(name) &&
    !/[<>:"/\\|?*\u0000-\u001f\u007f]/.test(name) &&
    !/^(\.{1,2}|template|con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(
      name,
    ) &&
    Buffer.byteLength(name, "utf8") <= 255
  );
}
