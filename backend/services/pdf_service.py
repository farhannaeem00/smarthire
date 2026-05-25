import pdfplumber
import os

def extract_text_from_pdf(file_path: str) -> str:
    text = ""

    # Try pdfplumber first
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"pdfplumber error: {e}")

    # Try PyPDF2 as fallback
    if not text.strip():
        try:
            import PyPDF2
            with open(file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
        except Exception as e:
            print(f"PyPDF2 error: {e}")

    return text.strip() if text.strip() else "Resume content unavailable"
