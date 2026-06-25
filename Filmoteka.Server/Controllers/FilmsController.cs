
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Filmoteka.Server.Models;
using Filmoteka.Server.Data;

public class FilmsController : Controller
{
    private readonly AppDbContext _context;

    public FilmsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: FILMS
    public async Task<IActionResult> Index()    
    {
        return View(await _context.Filmovi.ToListAsync());
    }

    // GET: FILMS/Details/5
    public async Task<IActionResult> Details(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var film = await _context.Filmovi
            .FirstOrDefaultAsync(m => m.Id == id);
        if (film == null)
        {
            return NotFound();
        }

        return View(film);
    }

    // GET: FILMS/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: FILMS/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,Naziv,Godina,Opis,ZanrId,Zanr,Reziseri")] Film film)
    {
        if (ModelState.IsValid)
        {
            _context.Add(film);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(film);
    }

    // GET: FILMS/Edit/5
    public async Task<IActionResult> Edit(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var film = await _context.Filmovi.FindAsync(id);
        if (film == null)
        {
            return NotFound();
        }
        return View(film);
    }

    // POST: FILMS/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(System.Guid? id, [Bind("Id,Naziv,Godina,Opis,ZanrId,Zanr,Reziseri")] Film film)
    {
        if (id != film.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(film);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FilmExists(film.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return RedirectToAction(nameof(Index));
        }
        return View(film);
    }

    // GET: FILMS/Delete/5
    public async Task<IActionResult> Delete(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var film = await _context.Filmovi
            .FirstOrDefaultAsync(m => m.Id == id);
        if (film == null)
        {
            return NotFound();
        }

        return View(film);
    }

    // POST: FILMS/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(System.Guid? id)
    {
        var film = await _context.Filmovi.FindAsync(id);
        if (film != null)
        {
            _context.Filmovi.Remove(film);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool FilmExists(System.Guid? id)
    {
        return _context.Filmovi.Any(e => e.Id == id);
    }
}
