import os
import json
import urllib.request
from urllib.parse import urlparse

def extract_urls_from_data(data):
    urls = []
    
    # Short links
    if 'shortLinks' in data:
        for link in data['shortLinks']:
            if link.get('url'):
                urls.append(link['url'])
            
    # Categories
    if 'categories' in data:
        for cat in data['categories']:
            for col in cat.get('columns', []):
                for sec in col.get('sections', []):
                    for link in sec.get('links', []):
                        if link.get('url'):
                            urls.append(link['url'])
                            
    return list(set(urls)) # Unique URLs

def download_icon(url, img_dir):
    try:
        domain = urlparse(url).hostname
        if not domain:
            domain = urlparse('https://' + url).hostname
            
        if not domain or domain == 'localhost':
            return
            
        clean_domain = domain.replace('www.', '')
        file_path = os.path.join(img_dir, f"{clean_domain}.ico")
        
        if os.path.exists(file_path):
            return
            
        print(f"Downloading icon for {domain}...")
        api_url = f"https://www.google.com/s2/favicons?domain={domain}&sz=64"
        req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            icon_data = response.read()
            if icon_data:
                with open(file_path, 'wb') as f:
                    f.write(icon_data)
                print(f" -> Saved: {file_path}")
                
    except Exception as e:
        print(f" -> Error downloading {url}: {e}")

def main():
    print("--- Startpage Favicon Downloader (Python) ---")
    
    # Paths adjusted for scripts folder
    js_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'js', 'links.js'))
    img_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'img'))
    
    if not os.path.exists(js_path):
        print(f"Error: Could not find {js_path}")
        return
        
    if not os.path.exists(img_dir):
        os.makedirs(img_dir)
        
    try:
        with open(js_path, 'r', encoding='utf-8') as f:
            content = f.read()
        start_idx = content.find('{')
        end_idx = content.rfind('}') + 1
        data = json.loads(content[start_idx:end_idx])
    except Exception as e:
        print(f"Error parsing links.js: {e}")
        return
        
    urls = extract_urls_from_data(data)
    print(f"Checking {len(urls)} URLs...")
    for url in urls:
        download_icon(url, img_dir)
    print("--- Done ---")

if __name__ == "__main__":
    main()
