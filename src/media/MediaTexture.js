/**
 * This object stores a THREE.Texture used for multi resolutions scene. It is
 * simplier (in terms of memory to store this object as it is tinier than a
 * FORGE.Image. It also remove the fact that we need to create a THREE.Texture
 * in the renderer.
 *
 * @constructor FORGE.MediaTexture
 * @param {FORGE.DisplayObject} texture - the THREE.Texture to store
 * @param {boolean} locked - is the texture locked (i.e. it isn't deletable)
 * @param {number} size - the size of the texture
 */
FORGE.MediaTexture = function(displayObject, locked)
{
    /**
     * The displayObject used to create a texture with (image or video)
     * @name FORGE.MediaTexture#_element
     * @type {FORGE.DisplayObject}
     * @private
     */
    this._displayObject = displayObject;

    /**
     * Can the texture be deleted ? Otherwise it is locked, e.g. it is a level 0
     * @name FORGE.MediaTexture#_locked
     * @type {boolean}
     * @private
     */
    this._locked = locked;

     /**
     * The texture
     * @name FORGE.MediaTexture#_texture
     * @type {THREE.Texture}
     * @private
     */
    this._texture = null;

    /**
     * The size of the texture
     * @name FORGE.MediaTexture#_size
     * @type {number}
     * @private
     */
    this._size = 0;

    /**
     * The time the texture was last used
     * @name FORGE.MediaTexture#_lastTime
     * @type {number}
     * @private
     */
    this._lastTime = window.performance.now();

    /**
     * The number of times the texture was used
     * @name FORGE.MediaTexture#_count
     * @type {number}
     * @private
     */
    this._count = 0;

    this._boot();
};

FORGE.MediaTexture.prototype.constructor = FORGE.MediaTexture;

/**
 * Boot routine
 * @method FORGE.MediaTexture#_boot
 */
FORGE.MediaTexture.prototype._boot = function()
{
    var width = this._displayObject.width;
    var height = this._displayObject.height;

    this._size = width * height;

    this._texture = new THREE.Texture();
    this._texture.needsUpdate = true;

    this._texture.format = THREE.RGBFormat;
    this._texture.mapping = THREE.Texture.DEFAULT_MAPPING;
    this._texture.magFilter = THREE.LinearFilter;
    this._texture.wrapS = THREE.ClampToEdgeWrapping;
    this._texture.wrapT = THREE.ClampToEdgeWrapping;

    if (FORGE.Math.isPowerOfTwo(width) && FORGE.Math.isPowerOfTwo(height))
    {
        // Enable mipmaps for flat rendering to avoid aliasing
        this._texture.generateMipmaps = true;
        this._texture.minFilter = THREE.LinearMipMapLinearFilter;
    }
    else
    {
        this._texture.generateMipmaps = false;
        this._texture.minFilter = THREE.LinearFilter;
    }

    this._texture.image = this._displayObject.canvas;
};

/**
 * Update texture
 * @method FORGE.MediaTexture#update
 */
FORGE.MediaTexture.prototype.update = function()
{
    this._texture.needsUpdate = true;
};

/**
 * Destroy routine
 * @method FORGE.MediaTexture#destroy
 */
FORGE.MediaTexture.prototype.destroy = function()
{
    if (this._texture !== null)
    {
        this._texture.dispose();
    }

    this._texture = null;

    this._displayObject = null;
};

/**
 * Get the texture.
 * @name  FORGE.MediaTexture#texture
 * @type {THREE.Texture}
 * @readonly
 */
Object.defineProperty(FORGE.MediaTexture.prototype, "texture",
{
    /** @this {FORGE.MediaTexture} */
    get: function()
    {
        this._count++;
        this._lastTime = window.performance.now();

        return this._texture;
    }
});

/**
 * Is the texture locked ?
 * @name  FORGE.MediaTexture#locked
 * @type {boolean}
 * @readonly
 */
Object.defineProperty(FORGE.MediaTexture.prototype, "locked",
{
    /** @this {FORGE.MediaTexture} */
    get: function()
    {
        return this._locked;
    }
});

/**
 * Get the size of the texture
 * @name  FORGE.MediaTexture#size
 * @type {number}
 * @readonly
 */
Object.defineProperty(FORGE.MediaTexture.prototype, "size",
{
    /** @this {FORGE.MediaTexture} */
    get: function()
    {
        return this._size;
    }
});

/**
 * Get the last time when it was called.
 * @name  FORGE.MediaTexture#lastTime
 * @type {number}
 * @readonly
 */
Object.defineProperty(FORGE.MediaTexture.prototype, "lastTime",
{
    /** @this {FORGE.MediaTexture} */
    get: function()
    {
        return this._lastTime;
    }
});

/**
 * Get the number of times it was called.
 * @name  FORGE.MediaTexture#count
 * @type {number}
 * @readonly
 */
Object.defineProperty(FORGE.MediaTexture.prototype, "count",
{
    /** @this {FORGE.MediaTexture} */
    get: function()
    {
        return this._count;
    }
});
