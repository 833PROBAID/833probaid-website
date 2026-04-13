"use client";

import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import gjsBlocksBasic from "grapesjs-blocks-basic";
import loadCustomBlocks from "./GrapesjsCustomBlocks";
import "grapesjs/dist/css/grapes.min.css";
import "./BlogGrapesEditor.css";
import publicPageStyles from "./publicPageStyles";

export default function BlogGrapesEditor({ initialContent, onSave }) {
	const editorRef = useRef(null);
	const instanceRef = useRef(null);
	const onSaveRef = useRef(onSave);
	const [editorReady, setEditorReady] = useState(false);

	// Keep onSaveRef up to date
	useEffect(() => {
		onSaveRef.current = onSave;
	}, [onSave]);

	// Function to get current editor content
	const getCurrentContent = () => {
		if (instanceRef.current) {
			const html = instanceRef.current.getHtml();
			const css = instanceRef.current.getCss();
			const state = JSON.stringify(instanceRef.current.getProjectData());
			return { html, css, state };
		}
		return { html: "", css: "", state: null };
	};

	useEffect(() => {
		if (editorRef.current && !instanceRef.current) {
			instanceRef.current = grapesjs.init({
				container: editorRef.current,
				height: "85vh",
				width: "auto",
				storageManager: false,
				panels: { defaults: [] },
				deviceManager: {
					devices: [
						{
							name: "Desktop",
							width: "",
						},
						{
							name: "Tablet",
							width: "768px",
							widthMedia: "992px",
						},
						{
							name: "Mobile",
							width: "320px",
							widthMedia: "480px",
						},
					],
				},
				plugins: [gjsPresetWebpage, gjsBlocksBasic],
				pluginsOpts: {
					gjsPresetWebpage: {
						blocksBasicOpts: {
							blocks: [
								"column1",
								"column2",
								"column3",
								"column3-7",
								"text",
								"link",
								"image",
								"video",
							],
							flexGrid: true,
						},
						blocks: ["link-block", "quote", "text-basic"],
					},
					gjsBlocksBasic: {},
				},
				canvas: {
					styles: [
						"https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400;700&family=Roboto:wght@400;900&family=League+Spartan:wght@400;700&family=Oswald&family=Poppins&family=Passions+Conflict&family=Sarpanch&display=swap",
						"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css",
						"/grapesjs-preview.css",
					],
				},
				styleManager: {
					sectors: [
						{
							name: "Typography",
							properties: [
								"font-family",
								"font-size",
								"font-weight",
								"letter-spacing",
								"color",
								"line-height",
								"text-align",
							],
						},
						{
							name: "Decorations",
							properties: [
								"background-color",
								"border",
								"border-radius",
								"box-shadow",
								"opacity",
							],
						},
						{
							name: "Extra",
							properties: ["transition", "perspective", "transform"],
						},
						{
							name: "Flex",
							properties: [
								"flex-direction",
								"flex-wrap",
								"justify-content",
								"align-items",
								"align-content",
								"order",
								"flex-basis",
								"flex-grow",
								"flex-shrink",
							],
						},
						{
							name: "Dimension",
							properties: [
								"width",
								"height",
								"max-width",
								"min-height",
								"margin",
								"padding",
							],
						},
					],
				},
			});

			// CSS is now injected via canvas.styles (/grapesjs-preview.css) for proper CSS variable support

			// Load custom blog blocks
			loadCustomBlocks(instanceRef.current);

			// Load initial content
			if (initialContent?.state) {
				try {
					const parsedState =
						typeof initialContent.state === "string"
							? JSON.parse(initialContent.state)
							: initialContent.state;
					instanceRef.current.loadProjectData(parsedState);
				} catch (error) {
					console.error("Error loading editor state:", error);
					if (initialContent.html) {
						instanceRef.current.setComponents(initialContent.html);
					}
					if (initialContent.css) {
						instanceRef.current.setStyle(initialContent.css);
					}
				}
			} else if (initialContent?.html || initialContent?.css) {
				if (initialContent.html) {
					instanceRef.current.setComponents(initialContent.html);
				}
				if (initialContent.css) {
					instanceRef.current.setStyle(initialContent.css);
				}
			}

			setEditorReady(true);
		}

		return () => {
			if (instanceRef.current) {
				instanceRef.current.destroy();
				instanceRef.current = null;
			}
		};
	}, [initialContent]);

	const handleSave = () => {
		const content = getCurrentContent();
		if (onSaveRef.current) {
			onSaveRef.current(content);
		}
	};

	const loadSampleBlog = () => {
		if (instanceRef.current) {
			const sampleHTML =``
			instanceRef.current.setComponents(sampleHTML);
			alert("Sample blog loaded with public-page matching section styles.");
		}
	};

	return (
		<div className='grapes-editor-container'>
			{editorReady && (
				<div className='editor-actions'>
					<button className='save-content-btn' onClick={handleSave}>
						💾 Save Content
					</button>{" "}
					<button className='load-sample-btn' onClick={loadSampleBlog}>
						📋 Load Sample Content
					</button>{" "}
				</div>
			)}
			<div ref={editorRef} className='editor-canvas'></div>
		</div>
	);
}
