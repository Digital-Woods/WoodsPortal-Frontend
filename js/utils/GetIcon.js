const folderImage = `{{ get_asset_url('../assets/FileIcons/folder.png') }}`
const pptImage = `{{ get_asset_url('../assets/FileIcons/ppt.png') }}`
const docsImage = `{{ get_asset_url('../assets/FileIcons/doc.png') }}`
const excelImage = `{{ get_asset_url('../assets/FileIcons/excel.png') }}`
const pdfImage = `{{ get_asset_url('../assets/FileIcons/audio.png') }}`
const imgImage = `{{ get_asset_url('../assets/FileIcons/image.png') }}`
const videoImage = `{{ get_asset_url('../assets/FileIcons/video.png') }}`
const audioImage = `{{ get_asset_url('../assets/FileIcons/audio.png') }}`
const blankImage = `{{ get_asset_url('../assets/FileIcons/blank.png') }}`
const getIcon = (filename, heightInPx = '24px', widthInPx = '24px') => {

    const extension = filename.split(".").pop().toLowerCase();
    const icons = {
        pdf: pdfImage,
        doc: docsImage,
        docx: docsImage,
        xls: excelImage,
        xlsx: excelImage,
        xlsm: excelImage,
        xltx: excelImage,
        csv: excelImage,
        xltm: excelImage,
        xlsb: excelImage,
        xlam: excelImage,
        ppt: pptImage,
        pptx: pptImage,
        potx: pptImage,
        pot: pptImage,
        pptm: pptImage,
        potm: pptImage,
        ppsx: pptImage,
        pps: pptImage,
        jpg: imgImage,
        jpeg: imgImage,
        png: imgImage,
        jfif: imgImage,
        webp: imgImage,
        gif: imgImage,
        bmp: imgImage,
        tiff: imgImage,
        heif: imgImage,
        svg: imgImage,
        eps: imgImage,
        raw: imgImage,
        psd: imgImage,
        ico: imgImage,
        exr: imgImage,
        ai: imgImage,
        mp3: audioImage,
        aac: audioImage,
        ogg: audioImage,
        wma: audioImage,
        m4a: audioImage,
        flac: audioImage,
        wv: audioImage,
        wav: audioImage,
        aiff: audioImage,
        opus: audioImage,
        amr: audioImage,
        dts: audioImage,
        ac3: audioImage,
        mid: audioImage,
        midi: audioImage,
        pcm: audioImage,
        au: audioImage,
        caf: audioImage,
        bwf: audioImage,
        mp4: videoImage,
        wmv: videoImage,
        flv: videoImage,
        m4v: videoImage,
        avi: videoImage,
        mov: videoImage,
        mxf: videoImage,
        mpg: videoImage,
        mpeg: videoImage,
        asf: videoImage,
        ogv: videoImage,
        swf: videoImage,
        mkv: videoImage,
        webm: videoImage,
        yuv: videoImage,
        dpx: videoImage,
        folder: folderImage,
    };

    return <img src={icons[extension] || blankImage} height={heightInPx} width={widthInPx} />;
};    