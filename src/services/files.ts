export function downloadFile(name: string, content: string) {
	const el = document.createElement("a")

	el.setAttribute(
		"href",
		`data:text/plan;charset=utf-8, ${encodeURIComponent(content)}`,
	)
	el.setAttribute("download", name)

	document.body.appendChild(el)
	el.click()

	document.body.removeChild(el)
}
