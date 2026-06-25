
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Filmoteka.Server.Models;
using Filmoteka.Server.Data;

public class RezisersController : Controller
{
    private readonly AppDbContext _context;

    public RezisersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: REZISERS
    public async Task<IActionResult> Index()    
    {
        return View(await _context.Reziseri.ToListAsync());
    }

    // GET: REZISERS/Details/5
    public async Task<IActionResult> Details(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var reziser = await _context.Reziseri
            .FirstOrDefaultAsync(m => m.Id == id);
        if (reziser == null)
        {
            return NotFound();
        }

        return View(reziser);
    }

    // GET: REZISERS/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: REZISERS/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,Ime,Prezime,DatumRodjenja,Filmovi")] Reziser reziser)
    {
        if (ModelState.IsValid)
        {
            _context.Add(reziser);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(reziser);
    }

    // GET: REZISERS/Edit/5
    public async Task<IActionResult> Edit(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var reziser = await _context.Reziseri.FindAsync(id);
        if (reziser == null)
        {
            return NotFound();
        }
        return View(reziser);
    }

    // POST: REZISERS/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(System.Guid? id, [Bind("Id,Ime,Prezime,DatumRodjenja,Filmovi")] Reziser reziser)
    {
        if (id != reziser.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(reziser);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReziserExists(reziser.Id))
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
        return View(reziser);
    }

    // GET: REZISERS/Delete/5
    public async Task<IActionResult> Delete(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var reziser = await _context.Reziseri
            .FirstOrDefaultAsync(m => m.Id == id);
        if (reziser == null)
        {
            return NotFound();
        }

        return View(reziser);
    }

    // POST: REZISERS/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(System.Guid? id)
    {
        var reziser = await _context.Reziseri.FindAsync(id);
        if (reziser != null)
        {
            _context.Reziseri.Remove(reziser);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool ReziserExists(System.Guid? id)
    {
        return _context.Reziseri.Any(e => e.Id == id);
    }
}
